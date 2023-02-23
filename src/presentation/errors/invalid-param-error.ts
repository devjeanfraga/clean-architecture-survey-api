export class InvalidParamError extends Error {
  constructor (field: string) {
    super(`Invalid ${field}`);
    this.name = "InvalidParamError";
  }
} 