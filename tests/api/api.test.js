import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { app } from '../../src/server.js';
import { seedDatabase } from '../../src/seed-data.js';
import User from '../../src/models/User.js';
import Tour from '../../src/models/Tour.js';
import Booking from '../../src/models/Booking.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongoServer.getUri(), { dbName: 'viva-amazonia-tests' });
});

beforeEach(async () => {
  await Booking.deleteMany({});
  await Tour.deleteMany({});
  await User.deleteMany({});
  await seedDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

async function login(email = 'ana@exemplo.com', password = 'turismo123') {
  const response = await request(app).post('/api/auth/login').send({ email, password });
  expect(response.status).toBe(200);
  return response.body.token;
}

describe('Saúde da API', () => {
  it('retorna o estado operacional da aplicação', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      service: 'viva-amazonia-api'
    });
  });
});

describe('Autenticação', () => {
  it('faz login com credenciais válidas', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'ana@exemplo.com',
      password: 'turismo123'
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTypeOf('string');
    expect(response.body.user.email).toBe('ana@exemplo.com');
  });

  it('rejeita credenciais inválidas', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'ana@exemplo.com',
      password: 'senha-incorreta'
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('E-mail ou senha inválidos.');
  });

  it('valida os dados obrigatórios no cadastro', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Teste',
      email: 'teste@exemplo.com',
      password: '123'
    });

    expect(response.status).toBe(400);
  });

  it('cria uma nova conta de turista', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Novo Turista',
      email: 'novo.turista@exemplo.com',
      password: 'turismo123'
    });

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({
      name: 'Novo Turista',
      email: 'novo.turista@exemplo.com',
      role: 'tourist'
    });
  });
});

describe('Passeios', () => {
  it('lista os passeios ativos', async () => {
    const response = await request(app).get('/api/tours');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(4);
  });

  it('filtra passeios pela cidade', async () => {
    const response = await request(app).get('/api/tours').query({ city: 'Manaus' });

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body.every(tour => tour.city === 'Manaus')).toBe(true);
  });

  it('retorna 404 para um passeio inexistente', async () => {
    const response = await request(app).get('/api/tours/507f1f77bcf86cd799439011');

    expect(response.status).toBe(404);
  });
});

describe('Reservas', () => {
  it('exige autenticação para listar reservas', async () => {
    const response = await request(app).get('/api/bookings/mine');

    expect(response.status).toBe(401);
  });

  it('rejeita checkout sem itens', async () => {
    const token = await login();
    const response = await request(app)
      .post('/api/bookings/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [] });

    expect(response.status).toBe(400);
  });

  it('confirma uma reserva e decrementa as vagas', async () => {
    const token = await login();
    const tour = await Tour.findOne({ name: 'Cachoeira de Iracema' });
    const spotsBefore = tour.availableSpots;

    const response = await request(app)
      .post('/api/bookings/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ tourId: tour._id.toString(), quantity: 2 }] });

    expect(response.status).toBe(201);
    expect(response.body.bookings).toHaveLength(1);
    expect(response.body.bookings[0].participants).toBe(2);

    const updatedTour = await Tour.findById(tour._id);
    expect(updatedTour.availableSpots).toBe(spotsBefore - 2);
  });
});
