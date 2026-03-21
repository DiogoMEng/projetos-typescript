export interface User {
  userId?: string;
  name: string;
  email: string;
  password: string;
  created_at?: string;
  updated_at?: string;
}

export type AuthCredentials = Pick<User, 'email' | 'password'>;