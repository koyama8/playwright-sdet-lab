import { env } from '../config/env.js';
import { demoMovieTitles, demoMovies, demoPeople, demoPeopleEmails } from '../data/demo-data.js';
import { prisma } from '../lib/prisma.js';
import { HttpError } from '../utils/http-error.js';

export class TestSupportService {
  async resetDemoData(userId: string) {
    if (env.NODE_ENV === 'production') {
      throw new HttpError(404, 'Route not found');
    }

    await prisma.$transaction(async (transaction) => {
      await transaction.person.deleteMany({ where: { email: { notIn: [...demoPeopleEmails] } } });
      await transaction.movie.deleteMany({ where: { title: { notIn: [...demoMovieTitles] } } });

      for (const person of demoPeople) {
        await transaction.person.upsert({
          where: { email: person.email },
          update: { ...person, createdById: userId },
          create: { ...person, createdById: userId },
        });
      }

      for (const movie of demoMovies) {
        await transaction.movie.upsert({
          where: { title: movie.title },
          update: { ...movie, createdById: userId },
          create: { ...movie, createdById: userId },
        });
      }
    });

    return {
      people: demoPeople.length,
      movies: demoMovies.length,
      resetAt: new Date().toISOString(),
    };
  }
}
