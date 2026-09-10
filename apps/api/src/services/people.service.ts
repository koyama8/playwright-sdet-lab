import type { Prisma, RecordStatus } from "@prisma/client";
import { PeopleRepository } from "../repositories/people.repository.js";
import { HttpError } from "../utils/http-error.js";

export class PeopleService {
  constructor(private readonly repository = new PeopleRepository()) {}
  async list(query: {
    q?: string;
    status?: RecordStatus;
    page: number;
    pageSize: number;
  }) {
    const where: Prisma.PersonWhereInput = {};
    if (query.q)
      where.OR = [
        { name: { contains: query.q, mode: "insensitive" } },
        { email: { contains: query.q, mode: "insensitive" } },
        { role: { contains: query.q, mode: "insensitive" } },
      ];
    if (query.status) where.status = query.status;
    const [items, total] = await this.repository.findMany(
      where,
      (query.page - 1) * query.pageSize,
      query.pageSize,
    );
    return {
      items,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    };
  }
  async get(id: string) {
    const item = await this.repository.findById(id);
    if (!item) throw new HttpError(404, "Person not found");
    return item;
  }
  async create(
    input: {
      name: string;
      email: string;
      phone: string;
      role: string;
      status: RecordStatus;
    },
    userId: string,
  ) {
    const normalizedInput = {
      ...input,
      email: input.email.trim().toLowerCase(),
    };
    if (await this.repository.findByEmail(normalizedInput.email))
      throw new HttpError(409, "A person with this email already exists");
    return this.repository.create({
      ...normalizedInput,
      createdBy: { connect: { id: userId } },
    });
  }
  async update(
    id: string,
    input: Partial<{
      name: string;
      email: string;
      phone: string;
      role: string;
      status: RecordStatus;
    }>,
  ) {
    await this.get(id);
    const normalizedInput = input.email
      ? { ...input, email: input.email.trim().toLowerCase() }
      : input;
    if (normalizedInput.email) {
      const existing = await this.repository.findByEmail(normalizedInput.email);
      if (existing && existing.id !== id)
        throw new HttpError(409, "A person with this email already exists");
    }
    return this.repository.update(id, normalizedInput);
  }
  async remove(id: string) {
    await this.get(id);
    await this.repository.delete(id);
  }
}
