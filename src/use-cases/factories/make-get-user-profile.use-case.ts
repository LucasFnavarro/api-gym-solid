import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-in-repository";
import { FetchUserCheckInHistoryUseCase } from "../fetch-user-check-ins-history.use-case";

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaCheckInsRepository();
  const useCase = new FetchUserCheckInHistoryUseCase(usersRepository);

  return useCase;
}
