import jwt from 'jsonwebtoken';
import { Encrypter } from "../../data/protocols/cryptography/encrypter";
import { Decrypter } from '../../data/usecases/db-load-account-by-token/db-load-account-by-token-protocols';

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secretKey: string ) {}
  async encrypt(value: string): Promise<string> {
    return jwt.sign({value}, this.secretKey); 
  }

  async decipher(value: string): Promise<string> {
    return jwt.verify(value, this.secretKey) as string;
  }
}