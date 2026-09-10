import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient, UserRole } from '@prisma/client';
import { demoMovies, demoPeople } from '../src/data/demo-data.js';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const passwordHash = await bcrypt.hash('pwd123', 12);
  const admin = await prisma.user.upsert({ where: { email: 'qa@adminlab.com' }, update: { passwordHash, active: true, role: UserRole.ADMIN }, create: { email: 'qa@adminlab.com', passwordHash, name: 'QA Admin', role: UserRole.ADMIN } });
  for (const person of demoPeople) await prisma.person.upsert({ where: { email: person.email }, update: person, create: { ...person, createdById: admin.id } });
  for (const movie of demoMovies) await prisma.movie.upsert({ where: { title: movie.title }, update: movie, create: { ...movie, createdById: admin.id } });
  console.log('Seed completed: qa@adminlab.com / pwd123');
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
