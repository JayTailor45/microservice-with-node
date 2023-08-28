import { CustomError } from "./custom-errors";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super("Not found");

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [{ message: "Not found" }];
  }
}
