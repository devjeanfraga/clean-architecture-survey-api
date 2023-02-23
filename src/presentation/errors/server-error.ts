export class ServerError extends Error {
  constructor (stack: string) {
    super ("Internal server error, please try again latter");
    this.name = "ServerError"; 
    this.stack = stack; 
  }
}