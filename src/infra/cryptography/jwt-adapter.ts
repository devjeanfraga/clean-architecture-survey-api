import jwt from 'jsonwebtoken';
import { json } from 'stream/consumers';
import { Encrypter } from "../../data/protocols/encrypter";

export class JwtAdapter implements Encrypter {
  constructor (private readonly secretKey: string ) {}
  async encrypt(value: string): Promise<string> {
    return jwt.sign({value}, this.secretKey); 
  }
}