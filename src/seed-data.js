import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Tour from './models/Tour.js';

export async function seedDatabase() {
  if (await User.countDocuments()) return;
  const password = await bcrypt.hash('turismo123', 10);
  const [ana, bruno, agencia] = await User.create([
    { name: 'Ana Souza', email: 'ana@exemplo.com', password, role: 'tourist' },
    { name: 'Bruno Lima', email: 'bruno@exemplo.com', password, role: 'tourist' },
    { name: 'Amazonas Expedições', email: 'contato@amazonas.com', password, role: 'provider' }
  ]);
  const day = n => new Date(Date.now() + n * 86400000);
  await Tour.create([
    { name: 'Encontro das Águas e Rio Negro', description: 'Navegue pelo Rio Negro e observe o fenômeno natural do encontro dos rios Negro e Solimões, com paradas para fotos e contemplação.', location: 'Porto de Manaus', city: 'Manaus', category: 'Passeio fluvial', price: 180, originalPrice: 220, date: day(3), availableSpots: 12, provider: agencia._id, image: '/images/encontrodasaguas.jpg' },
    { name: 'Cachoeira de Iracema', description: 'Dia de natureza em uma das cachoeiras mais conhecidas da região, com trilha leve e tempo para banho conforme as condições locais.', location: 'Parque Ecológico Iracema', city: 'Presidente Figueiredo', category: 'Cachoeiras e trilhas', price: 145, date: day(5), availableSpots: 8, provider: agencia._id, image: '/images/iracema.jpg' },
    { name: 'Caverna do Maroaga e Gruta da Judéia', description: 'Explore formações naturais e trilhas em área de floresta amazônica acompanhado por guia local.', location: 'Reserva de Maroaga', city: 'Presidente Figueiredo', category: 'Natureza e aventura', price: 210, date: day(7), availableSpots: 10, provider: agencia._id, image: '/images/maroaga.jpg' },
    { name: 'Experiência ribeirinha e sabores amazônicos', description: 'Conheça o cotidiano de uma comunidade ribeirinha, sua relação com o rio e sabores tradicionais da região.', location: 'Zona rural de Manaus', city: 'Manaus', category: 'Cultura regional', price: 250, originalPrice: 300, date: day(10), availableSpots: 6, provider: agencia._id, image: '/images/gastronomia-amazonica.jpg' }
  ]);
}