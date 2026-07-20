import { AppError } from './AppError';

export class BadRequestError extends AppError {
  constructor(message = 'Requisição inválida') {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Não autenticado') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Acesso negado') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso não encontrado') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflito com o estado atual do recurso') {
    super(message, 409);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Dados inválidos', public readonly details?: string[]) {
    super(message, 422);
  }
}