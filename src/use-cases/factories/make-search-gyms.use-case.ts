import { PrismaGymsRepository } from "@/repositories/prisma/prisma.gyms-repository";
import { SearchGymUseCase } from "../search-gyms.use-case";

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new SearchGymUseCase(gymsRepository);

  return useCase;
}
