/**
 * Centralized API endpoint constants.
 * No route string should be used directly in services — always reference this file.
 */

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
  },

  // Users (public)
  USERS: {
    BASE: "/users",
    BY_ID: (userId: string) => `/users/${userId}`,
  },

  // Categories (protected)
  CATEGORIES: {
    BASE: "/categories",
    BY_ID: (categoryId: string) => `/categories/${categoryId}`,
  },

  // Box Bottoms / Caixas (protected)
  BOX_BOTTOMS: {
    BASE: "/box-bottoms",
    BY_ID: (boxBottomId: string) => `/box-bottoms/${boxBottomId}`,
  },

  // Transactions (protected)
  TRANSACTIONS: {
    BASE: "/transactions",
    CREATE: (boxBottomId: string, categoryId: string) =>
      `/transactions/box-bottom/${boxBottomId}/category/${categoryId}`,
    BY_ID: (transactionId: string) => `/transactions/${transactionId}`,
  },

  // Role User Box Bottom (protected)
  ROLE_USER_BOX_BOTTOMS: {
    REGISTER: (boxBottomId: string) =>
      `/role-user-box-bottoms/box-bottom/${boxBottomId}/register/`,
    BY_BOX_BOTTOM: (boxBottomId: string) =>
      `/role-user-box-bottoms/box-bottom/${boxBottomId}`,
    UPDATE: (userId: string, boxBottomId: string) =>
      `/role-user-box-bottoms/box-bottom/${userId}/${boxBottomId}`,
    DELETE: (roleUserBoxBottomId: string) =>
      `/role-user-box-bottoms/${roleUserBoxBottomId}`,
  },

  // Roles (protected)
  ROLES: {
    BASE: "/roles",
  },
} as const;
