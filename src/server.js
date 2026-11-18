import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/auth.js';
import tourRoutes from './routes/tours.js';
import bookingRoutes from './routes/bookings.js';
import { seedDatabase } from './seed-data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors({ origin: process.env.WEB_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
const openapiPath = path.resolve(__dirname, '../docs/openapi.yaml');

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'viva-amazonia-api' }));
app.get('/api-docs.yaml', (_req, res) => res.type('text/yaml').send(fs.readFileSync(openapiPath, 'utf8')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(undefined, {
  swaggerOptions: { url: '/api-docs.yaml' },
  customSiteTitle: 'Viva Amazônia API — Swagger'
}));
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use((req, res) => res.status(404).json({ message: `Rota não encontrada: ${req.method} ${req.path}` }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 4000;
let mongoServer;
try {
  mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongoServer.getUri(), { dbName: 'viva-amazonia' });
  await seedDatabase();
  app.listen(PORT, () => console.log(`API: http://localhost:${PORT} | Swagger: http://localhost:${PORT}/api-docs`));
} catch (error) {
  console.error('Falha ao iniciar API/banco em memória:', error);
  process.exit(1);
}
const shutdown = async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);