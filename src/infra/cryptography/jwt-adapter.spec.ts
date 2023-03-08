import jwt from 'jsonwebtoken'; 
import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'any-encrypted-string';      
  }
}))

const secretKey = 'any-secret-key'; 
const makeSut = (): JwtAdapter => {
  const sut = new JwtAdapter(secretKey);
  return sut; 
}

describe('JwtAdapter', () => {
  it('should calls sign with correct values', async () => {
    const sut = makeSut(); 
    const spysign = jest.spyOn(jwt, 'sign');
 
    sut.encrypt('any-string');
    expect(spysign).toHaveBeenCalledWith({value: 'any-string'}, secretKey);
  })
});