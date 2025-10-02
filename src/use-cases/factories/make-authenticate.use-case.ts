import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUserUseCase } from "@/use-cases/authenticate.use-case";

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const authenticateUseCase = new AuthenticateUserUseCase(usersRepository);

  return authenticateUseCase;
}
