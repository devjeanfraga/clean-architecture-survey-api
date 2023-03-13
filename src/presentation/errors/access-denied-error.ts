export class AccessDeniedError extends Error {
  constructor () {
    super('AccessDeniedError');
    this.name = "AccessDeniedError"
  }
}