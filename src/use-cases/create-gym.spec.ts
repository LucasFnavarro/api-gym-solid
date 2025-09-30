import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym.use-case";

let userRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    userRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(userRepository);
  });

  it("should be able to register", async () => {
    const { gym } = await sut.execute({
      title: "Javascript Gym",
      description: null,
      phone: null,
      latitude: -23.3036844,
      longitude: -51.2073777,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
