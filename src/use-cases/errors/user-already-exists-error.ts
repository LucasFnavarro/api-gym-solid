export class UserAlreadyExistsError extends Error {
  constructor() {
    super("Email or password incorrectly.");
  }
}
