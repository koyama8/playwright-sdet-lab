import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export class MoviesRepository {
  findMany(filter: Prisma.MovieWhereInput, skip: number, take: number) {
    return Promise.all([
      prisma.movie.findMany({
        where: filter,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.movie.count({ where: filter }),
    ]);
  }
  findById(id: string) {
    return prisma.movie.findUnique({ where: { id } });
  }
  findByTitle(title: string) {
    return prisma.movie.findFirst({
      where: { title: { equals: title, mode: "insensitive" } },
    });
  }
  create(data: Prisma.MovieCreateInput) {
    return prisma.movie.create({ data });
  }
  update(id: string, data: Prisma.MovieUpdateInput) {
    return prisma.movie.update({ where: { id }, data });
  }
  delete(id: string) {
    return prisma.movie.delete({ where: { id } });
  }
}
