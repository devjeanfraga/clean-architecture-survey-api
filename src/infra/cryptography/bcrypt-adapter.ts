import bcrypt from "bcrypt";
import { Hasher } from "../../data/protocols/hasher";
import { HasherCompare } from "../../data/protocols/hasher-compare";

export class BcryptAdapter implements Hasher, HasherCompare {
  constructor (private readonly salt: number ) {}

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt); 
  }

  async compare(value: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(value, encrypted);
  }
} 