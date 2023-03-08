export interface  HasherCompare {
  compare(value:string, encrypted: string): Promise<boolean>
}