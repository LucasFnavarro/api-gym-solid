import { prisma } from "../../lib/prisma";
import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
    });
  }
}
