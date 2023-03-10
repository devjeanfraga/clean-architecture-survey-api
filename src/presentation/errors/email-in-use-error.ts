export class EmailInUseError extends Error {
  constructor () {
    super('EmailInUseError');
    this.name = "EmailInUseError"
  }
}