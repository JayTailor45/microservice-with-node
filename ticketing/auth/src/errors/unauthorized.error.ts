import { CustomError } from "./custom-errors";

export class UnAuthorizedError extends CustomError {
  statusCode = 400;

  constructor() {
    super("Not authorized");
    Object.setPrototypeOf(this, UnAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not authorized" }];
  }
}
