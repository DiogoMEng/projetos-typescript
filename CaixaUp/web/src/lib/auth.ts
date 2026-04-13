import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "accessToken";

export interface JwtPayload {
  userId: string;
  email: string;
  exp?: number;
  iat?: number;
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // Check expiration
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}
