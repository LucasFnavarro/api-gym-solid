import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-in-repository";
import { FetchUserCheckInHistoryUseCase } from "../fetch-user-check-ins-history.use-case";

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new FetchUserCheckInHistoryUseCase(checkInsRepository);

  return useCase;
}
