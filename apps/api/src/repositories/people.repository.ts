import type { Prisma, RecordStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export class PeopleRepository {
  findMany(filter: Prisma.PersonWhereInput, skip: number, take: number) {
    return Promise.all([
      prisma.person.findMany({
        where: filter,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.person.count({ where: filter }),
    ]);
  }
  findById(id: string) {
    return prisma.person.findUnique({ where: { id } });
  }
  findByEmail(email: string) {
    return prisma.person.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });
  }
  create(data: Prisma.PersonCreateInput) {
    return prisma.person.create({ data });
  }
  update(id: string, data: Prisma.PersonUpdateInput) {
    return prisma.person.update({ where: { id }, data });
  }
  delete(id: string) {
    return prisma.person.delete({ where: { id } });
  }
  countByStatus(status: RecordStatus) {
    return prisma.person.count({ where: { status } });
  }
}
