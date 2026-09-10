import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { demoMovieTitles, demoMovies, demoPeople, demoPeopleEmails } from '../src/data/demo-data.js';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL ?? '';
  if (process.env.NODE_ENV === 'production' || !databaseUrl.includes('playwright_lab')) {
    throw new Error('Reset refused: this command only runs against the Playwright Lab database.');
  }

  const admin = await prisma.user.findUnique({ where: { email: 'qa@adminlab.com' } });
  if (!admin) throw new Error('Run npm run api:seed before resetting demo data.');

  await prisma.$transaction(async (transaction) => {
    await transaction.person.deleteMany({ where: { email: { notIn: [...demoPeopleEmails] } } });
    await transaction.movie.deleteMany({ where: { title: { notIn: [...demoMovieTitles] } } });

    for (const person of demoPeople) {
      await transaction.person.upsert({
        where: { email: person.email },
        update: { ...person, createdById: admin.id },
        create: { ...person, createdById: admin.id },
      });
    }
    for (const movie of demoMovies) {
      await transaction.movie.upsert({
        where: { title: movie.title },
        update: { ...movie, createdById: admin.id },
        create: { ...movie, createdById: admin.id },
      });
    }
  });

  console.log(`Demo data reset: ${demoPeople.length} people and ${demoMovies.length} movies.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
