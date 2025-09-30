import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in.use-case";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let userRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(async () => {
    userRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(userRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "Academia JavaScript Gym",
      description: "",
      phone: "",
      latitude: -23.3036844,
      longitude: -51.2073777,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.3036844,
      userLongitude: -51.2073777,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 8, 15, 14, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.3036844,
      userLongitude: -51.2073777,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -23.3036844,
        userLongitude: -51.2073777,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 8, 15, 14, 0, 0)); // 15/set

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.3036844,
      userLongitude: -51.2073777,
    });

    vi.setSystemTime(new Date(2022, 8, 16, 14, 0, 0)); // 16/set

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.3036844,
      userLongitude: -51.2073777,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "Academia JavaScript Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-14.287209),
      longitude: new Decimal(-35.8707932),
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -23.3036844,
        userLongitude: -21.2073777,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
