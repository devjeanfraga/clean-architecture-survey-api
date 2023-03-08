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
 
    await sut.encrypt('any-string');
    expect(spysign).toHaveBeenCalledWith({value: 'any-string'}, secretKey);
  });

  it('should return a encrypted string if sign method on success', async () => {
    const sut = makeSut(); 
 
    const promise =  await sut.encrypt('any-string');
    expect(promise).toEqual('any-encrypted-string');
  });

  it('should calls sign with correct values', async () => {
    const sut = makeSut(); 
     jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error();
     });
    const promise = sut.encrypt('any-string');
    await expect(promise).rejects.toThrow();
  }); 
});