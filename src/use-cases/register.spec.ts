import { beforeEach, describe, expect, it } from "vitest";
import { RegisterUseCase } from "./register.use-case";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { compare } from "bcryptjs";

let userRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(userRepository);
  });

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "John doe",
      email: "johndoe@example.com",
      password: "123123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should throw an error if the user tries to register with an existing email", async () => {
    const email = "johndoe@example.com";

    await sut.execute({
      name: "John doe",
      email,
      password: "123123",
    });

    await expect(() =>
      sut.execute({
        name: "John doe",
        email,
        password: "123123",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it("should hash user password upon registration", async () => {
    const email = "johndoe@example.com";

    const { user } = await sut.execute({
      name: "John doe",
      email,
      password: "123123",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123123",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });
});
