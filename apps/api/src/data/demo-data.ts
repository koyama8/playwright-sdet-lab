import { RecordStatus } from '@prisma/client';

export const demoPeople = [
  { name: 'Ana Martins', email: 'ana.martins@lab.local', phone: '(11) 99991-1001', role: 'QA Engineer', status: RecordStatus.ACTIVE },
  { name: 'Bruno Lima', email: 'bruno.lima@lab.local', phone: '(21) 99992-1002', role: 'Developer', status: RecordStatus.ACTIVE },
  { name: 'Carla Souza', email: 'carla.souza@lab.local', phone: '(31) 99993-1003', role: 'Product Owner', status: RecordStatus.ACTIVE },
  { name: 'Diego Alves', email: 'diego.alves@lab.local', phone: '(41) 99994-1004', role: 'SDET', status: RecordStatus.INACTIVE },
  { name: 'Elisa Rocha', email: 'elisa.rocha@lab.local', phone: '(51) 99995-1005', role: 'UX Designer', status: RecordStatus.ACTIVE },
] as const;

export const demoMovies = [
  { title: 'Interestelar', imageUrl: '/movie-posters/interstellar.jpg', genre: 'Ficção científica', year: 2014, rating: 8.7, favorite: true, synopsis: 'Exploradores atravessam o espaço em busca de um novo lar.' },
  { title: 'O Poderoso Chefão', imageUrl: '/movie-posters/the-godfather.jpg', genre: 'Drama', year: 1972, rating: 9.2, favorite: true, synopsis: 'Uma família enfrenta poder, lealdade e escolhas difíceis.' },
  { title: 'A Origem', imageUrl: '/movie-posters/inception.jpg', genre: 'Ficção científica', year: 2010, rating: 8.8, favorite: true, synopsis: 'Uma equipe invade sonhos para implantar uma ideia.' },
  { title: 'Clube da Luta', imageUrl: '/movie-posters/fight-club.jpg', genre: 'Drama', year: 1999, rating: 8.8, favorite: true, synopsis: 'Um homem encontra uma forma radical de escapar da rotina.' },
  { title: 'Matrix', imageUrl: '/movie-posters/the-matrix.png', genre: 'Ação', year: 1999, rating: 8.7, favorite: true, synopsis: 'Um programador descobre que sua realidade não é o que parece.' },
  { title: 'Forrest Gump', imageUrl: '/movie-posters/forrest-gump.jpg', genre: 'Drama', year: 1994, rating: 8.8, favorite: false, synopsis: 'Uma vida extraordinária atravessa momentos históricos.' },
  { title: 'O Senhor dos Anéis', imageUrl: '/movie-posters/the-lord-of-the-rings.jpg', genre: 'Fantasia', year: 2001, rating: 8.9, favorite: false, synopsis: 'Uma jornada para destruir um anel de enorme poder.' },
  { title: 'Vingadores: Ultimato', imageUrl: '/movie-posters/avengers-endgame.jpg', genre: 'Ação', year: 2019, rating: 8.4, favorite: false, synopsis: 'Heróis se unem para restaurar o universo.' },
] as const;

export const demoPeopleEmails = demoPeople.map(({ email }) => email);
export const demoMovieTitles = demoMovies.map(({ title }) => title);
