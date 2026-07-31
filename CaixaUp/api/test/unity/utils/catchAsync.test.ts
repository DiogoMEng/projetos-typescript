import { describe, it, expect, jest } from '@jest/globals';
import { catchAsync } from '#utils/catchAsync.js';

describe('catchAsync utility unit tests', () => {
  const createContext = () => {
    const req: any = {};
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();
    return { req, res, next };
  };

  it('U36 - resolve normalmente sem interferir no fluxo', async () => {
    const { req, res, next } = createContext();
    const handler = jest.fn().mockResolvedValue(undefined);

    const wrapped = catchAsync(handler);
    wrapped(req, res, next);

    await Promise.resolve();

    expect(handler).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('U37 - retorna 404 para erros com "not found" na mensagem', async () => {
    const { req, res, next } = createContext();
    const error = new Error('recurso not found');
    const handler = jest.fn().mockRejectedValue(error);

    const wrapped = catchAsync(handler);
    wrapped(req, res, next);

    await Promise.resolve();

    expect(next).toHaveBeenCalledWith(error);
  });

  it('U38 - retorna 400 para erros sem "not found" na mensagem', async () => {
    const { req, res, next } = createContext();
    const error = new Error('erro genérico');
    const handler = jest.fn().mockRejectedValue(error);

    const wrapped = catchAsync(handler);
    wrapped(req, res, next);

    await Promise.resolve();

    expect(next).toHaveBeenCalledWith(error);
  });

  it('U39 - retorna 500 com mensagem genérica para valores não-Error', async () => {
    const { req, res, next } = createContext();
    const handler = jest.fn().mockRejectedValue('falha');

    const wrapped = catchAsync(handler);
    wrapped(req, res, next);

    await Promise.resolve();

    expect(next).toHaveBeenCalledWith('falha');
  });

  it('U40 - não permite que uma rejeição não tratada escape', async () => {
    const { req, res, next } = createContext();
    const handler = jest.fn().mockRejectedValue(new Error('boom'));
    const wrapped = catchAsync(handler);

    await expect(new Promise((resolve) => {
      wrapped(req, res, next);
      setTimeout(resolve, 0);
    })).resolves.toBeUndefined();
  });
});
