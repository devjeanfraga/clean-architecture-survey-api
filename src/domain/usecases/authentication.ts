export interface AuthenticationModel {
  email: string;
  password: string;
  rule?: string; 
}

export interface Authentication {
  auth (credentials: AuthenticationModel): Promise<string>
}