import axios from "axios";
import { ENDPOINTS } from "./endpoints";
import { getToken, removeToken } from "./auth";

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ---------------------------------------------------------------------------
// Request interceptor — inject JWT (skip public routes)
// ---------------------------------------------------------------------------

const PUBLIC_ROUTES: string[] = [ENDPOINTS.AUTH.LOGIN, ENDPOINTS.USERS.BASE];

api.interceptors.request.use((config) => {
  const isPublicPost =
    config.method?.toLowerCase() === "post" &&
    PUBLIC_ROUTES.some((route) => config.url === route);

  if (!isPublicPost) {
    const token = getToken();
    console.log("[CaixaUp] Interceptor — token presente:", !!token, "| URL:", config.url);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ---------------------------------------------------------------------------
// Response interceptor — standardize error handling + auto-logout on 401
// ---------------------------------------------------------------------------

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = "/login";
    }

    let message =
      error.response?.data?.message || "Ocorreu um erro inesperado. Tente novamente.";

    // Sanitize technical backend errors (e.g. bcrypt exceptions) that leak to the frontend
    if (
      typeof message === "string" &&
      (message.includes("Illegal arguments") ||
        message.includes("undefined") ||
        message.includes("null") ||
        message.includes("Cannot read properties"))
    ) {
      message = "Ocorreu um erro interno no servidor. Verifique os dados e tente novamente.";
    }

    // Attach a friendly message to the error for consumers
    error.friendlyMessage = message;

    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
// API response type
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  description: string;
  value: number;
  movementType: "inflow" | "outflow";
  category_id: string;
  category?: Category;
  box_id: string;
  box?: Box;
  transactionDate: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: "receita" | "despesa";
  color?: string;
  icon?: string;
}

export interface Box {
  id: string;
  name: string;
  description?: string;
  targetValue?: string;
  balance?: number;
}

export interface Role {
  role_id: string; // uuidv4
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface RoleUserBoxBottom {
  id: string;
  user_id: string;
  box_bottom_id: string;
  role_id: string;
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

import { HttpClientAdapter } from "./HttpAdapter";

const httpAdapter = new HttpClientAdapter(api);

// Auth
export const authService = {
  login: (email: string, password: string) =>
    api.post<{ accessToken: string }>(
      ENDPOINTS.AUTH.LOGIN,
      { email, password }
    ),
};

// Users (public POST, protected GET/PUT/DELETE)
export const userService = {
  create: (data: { name: string; email: string; password: string }) =>
    httpAdapter.post<User>(ENDPOINTS.USERS.BASE, data),

  getAll: () =>
    httpAdapter.get<User[]>(ENDPOINTS.USERS.BASE),

  getById: (userId: string) =>
    httpAdapter.get<User>(ENDPOINTS.USERS.BY_ID(userId)),

  update: (userId: string, data: Partial<User>) =>
    httpAdapter.put<User>(ENDPOINTS.USERS.BY_ID(userId), data),

  delete: (userId: string) =>
    httpAdapter.delete<null>(ENDPOINTS.USERS.BY_ID(userId)),
};

// Categories
export const categoryService = {
  create: (data: { name: string; type: "receita" | "despesa" }) =>
    httpAdapter.post<Category>(ENDPOINTS.CATEGORIES.BASE, data),

  getAll: () =>
    httpAdapter.get<Category[]>(ENDPOINTS.CATEGORIES.BASE),

  getById: (categoryId: string) =>
    httpAdapter.get<Category>(ENDPOINTS.CATEGORIES.BY_ID(categoryId)),

  update: (categoryId: string, data: Partial<Category>) =>
    httpAdapter.put<Category>(ENDPOINTS.CATEGORIES.BY_ID(categoryId), data),

  delete: (categoryId: string) =>
    httpAdapter.delete<null>(ENDPOINTS.CATEGORIES.BY_ID(categoryId)),
};

// Box Bottoms / Caixas
export const boxService = {
  create: (data: { name: string; description: string; targetValue: string }) =>
    httpAdapter.post<Box>(ENDPOINTS.BOX_BOTTOMS.BASE, data),

  getAll: () =>
    httpAdapter.get<Box[]>(ENDPOINTS.BOX_BOTTOMS.BASE),

  getById: (boxBottomId: string) =>
    httpAdapter.get<Box>(ENDPOINTS.BOX_BOTTOMS.BY_ID(boxBottomId)),

  update: (boxBottomId: string, data: Partial<Box>) =>
    httpAdapter.put<Box>(ENDPOINTS.BOX_BOTTOMS.BY_ID(boxBottomId), data),

  delete: (boxBottomId: string) =>
    httpAdapter.delete<null>(ENDPOINTS.BOX_BOTTOMS.BY_ID(boxBottomId)),
};

// Transactions — POST uses compound URL: /transactions/box-bottom/:boxBottomId/category/:categoryId
export const transactionService = {
  create: (
    boxBottomId: string,
    categoryId: string,
    data: { movementType: "inflow" | "outflow"; value: number; transactionDate: string; description: string }
  ) =>
    httpAdapter.post<Transaction>(
      ENDPOINTS.TRANSACTIONS.CREATE(boxBottomId, categoryId),
      data
    ),

  getAll: (params?: Record<string, string>) =>
    httpAdapter.get<Transaction[]>(ENDPOINTS.TRANSACTIONS.BASE, { params }),

  getById: (transactionId: string) =>
    httpAdapter.get<Transaction>(ENDPOINTS.TRANSACTIONS.BY_ID(transactionId)),

  update: (transactionId: string, data: Partial<Transaction>) =>
    httpAdapter.put<Transaction>(ENDPOINTS.TRANSACTIONS.BY_ID(transactionId), data),

  delete: (transactionId: string) =>
    httpAdapter.delete<null>(ENDPOINTS.TRANSACTIONS.BY_ID(transactionId)),
};

// Role User Box Bottoms
export const roleUserBoxBottomService = {
  register: (boxBottomId: string, data: { roleId: string }) =>
    httpAdapter.post<RoleUserBoxBottom>(
      ENDPOINTS.ROLE_USER_BOX_BOTTOMS.REGISTER(boxBottomId),
      data
    ),

  getByBoxBottom: (boxBottomId: string) =>
    httpAdapter.get<RoleUserBoxBottom[]>(
      ENDPOINTS.ROLE_USER_BOX_BOTTOMS.BY_BOX_BOTTOM(boxBottomId)
    ),

  update: (userId: string, boxBottomId: string, data: Partial<RoleUserBoxBottom>) =>
    httpAdapter.put<RoleUserBoxBottom>(
      ENDPOINTS.ROLE_USER_BOX_BOTTOMS.UPDATE(userId, boxBottomId),
      data
    ),

  delete: (roleUserBoxBottomId: string) =>
    httpAdapter.delete<null>(
      ENDPOINTS.ROLE_USER_BOX_BOTTOMS.DELETE(roleUserBoxBottomId)
    ),
};

// Roles
export const roleService = {
  getAll: () =>
    httpAdapter.get<Role[]>(ENDPOINTS.ROLES.BASE),
};
