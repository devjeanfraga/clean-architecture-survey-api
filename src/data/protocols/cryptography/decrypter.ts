export interface Decrypter {
  decipher (value: string): Promise<string>
}