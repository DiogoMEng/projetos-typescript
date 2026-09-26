# 🧪 GUIA COMPLETO DE TESTES - E2E, INTEGRAÇÃO E UNIDADE

---

## 🎯 VISÃO GERAL

Este documento define o **padrão obrigatório de testes** para toda nova funcionalidade ou modificação desenvolvida no projeto. O objetivo é garantir:

- **Cobertura de código ≥ 95-100%**
- **Zero regressions** em funcionalidades existentes
- **Confiança** na implementação
- **Documentação viva** através dos testes
- **Facilidade de manutenção** e refatoração
- **Qualidade sustentável** do projeto

### 📊 Métrica de Cobertura Obrigatória

```
Statements   : 95-100%
Branches     : 90-100%
Functions    : 95-100%
Lines        : 95-100%
```

---

## 📁 ESTRUTURA DE PASTAS OBRIGATÓRIA

### Backend

```
project-root/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── users/
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   ├── repositories/
│   │   │   │   └── models/
│   │   │   └── ...
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── config/
│   ├── tests/
│   │   ├── E2E/
│   │   │   ├── auth.e2e.test.ts
│   │   │   ├── users.e2e.test.ts
│   │   │   ├── products.e2e.test.ts
│   │   │   └── fixtures/
│   │   │       ├── users.fixture.ts
│   │   │       ├── products.fixture.ts
│   │   │       └── database.setup.ts
│   │   ├── integration/
│   │   │   ├── repositories/
│   │   │   │   ├── user.repository.integration.test.ts
│   │   │   │   ├── product.repository.integration.test.ts
│   │   │   │   └── ...
│   │   │   ├── services/
│   │   │   │   ├── user.service.integration.test.ts
│   │   │   │   ├── product.service.integration.test.ts
│   │   │   │   └── ...
│   │   │   ├── middlewares/
│   │   │   │   ├── auth.middleware.integration.test.ts
│   │   │   │   └── ...
│   │   │   └── helpers/
│   │   │       ├── database.helper.ts
│   │   │       └── seeders.ts
│   │   ├── unity/
│   │   │   ├── services/
│   │   │   │   ├── user.service.unit.test.ts
│   │   │   │   ├── product.service.unit.test.ts
│   │   │   │   └── ...
│   │   │   ├── utils/
│   │   │   │   ├── validators.unit.test.ts
│   │   │   │   ├── formatters.unit.test.ts
│   │   │   │   └── ...
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.unit.test.ts
│   │   │   │   └── ...
│   │   │   └── helpers/
│   │   │       └── mocks.ts
│   │   └── coverage/
│   │       └── (gerado automaticamente)
│   ├── jest.config.js
│   ├── jest.setup.ts
│   └── package.json
```

### Frontend

```
project-root/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Form/
│   │   │   └── ...
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── context/
│   ├── tests/
│   │   ├── E2E/
│   │   │   ├── auth.e2e.test.ts
│   │   │   ├── user-flow.e2e.test.ts
│   │   │   ├── product-purchase.e2e.test.ts
│   │   │   └── fixtures/
│   │   │       ├── users.fixture.ts
│   │   │       └── test-data.ts
│   │   ├── integration/
│   │   │   ├── pages/
│   │   │   │   ├── login.page.integration.test.tsx
│   │   │   │   ├── dashboard.page.integration.test.tsx
│   │   │   │   └── ...
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.integration.test.ts
│   │   │   │   ├── useFetch.integration.test.ts
│   │   │   │   └── ...
│   │   │   ├── services/
│   │   │   │   ├── api.service.integration.test.ts
│   │   │   │   └── ...
│   │   │   └── helpers/
│   │   │       ├── mock-api.ts
│   │   │       └── render-utils.ts
│   │   ├── unity/
│   │   │   ├── components/
│   │   │   │   ├── Button.unit.test.tsx
│   │   │   │   ├── Card.unit.test.tsx
│   │   │   │   ├── Form.unit.test.tsx
│   │   │   │   └── ...
│   │   │   ├── hooks/
│   │   │   │   ├── useForm.unit.test.ts
│   │   │   │   ├── useLocalStorage.unit.test.ts
│   │   │   │   └── ...
│   │   │   ├── utils/
│   │   │   │   ├── validators.unit.test.ts
│   │   │   │   ├── formatters.unit.test.ts
│   │   │   │   └── ...
│   │   │   └── helpers/
│   │   │       └── test-mocks.ts
│   │   └── coverage/
│   │       └── (gerado automaticamente)
│   ├── jest.config.js
│   ├── jest.setup.ts
│   └── package.json
```

---

## 🔧 CONFIGURAÇÃO DE FERRAMENTAS

### Backend - Jest + Supertest

#### `backend/jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/main.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testTimeout: 30000,
  verbose: true,
  // E2E separados
  projects: [
    {
      displayName: 'unit',
      testMatch: ['**/tests/unity/**/*.test.ts'],
      testEnvironment: 'node',
    },
    {
      displayName: 'integration',
      testMatch: ['**/tests/integration/**/*.test.ts'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/integration/helpers/database.helper.ts'],
    },
    {
      displayName: 'e2e',
      testMatch: ['**/tests/E2E/**/*.test.ts'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/E2E/fixtures/database.setup.ts'],
    },
  ],
};
```

#### `backend/jest.setup.ts`

```typescript
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

beforeAll(() => {
  console.log('🧪 Iniciando testes...');
});

afterAll(() => {
  console.log('✅ Testes finalizados');
});

// Mock de logger
jest.mock('@/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));
```

#### `backend/package.json`

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest --selectProjects unit",
    "test:integration": "jest --selectProjects integration",
    "test:e2e": "jest --selectProjects e2e",
    "test:all": "jest --selectProjects unit integration e2e",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  }
}
```

### Frontend - Jest + React Testing Library

#### `frontend/jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/tests/**/*.test.{ts,tsx}'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
      },
    }],
  },
  testTimeout: 30000,
  verbose: true,
  projects: [
    {
      displayName: 'unit',
      testMatch: ['**/tests/unity/**/*.test.{ts,tsx}'],
    },
    {
      displayName: 'integration',
      testMatch: ['**/tests/integration/**/*.test.{ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/tests/integration/helpers/mock-api.ts'],
    },
    {
      displayName: 'e2e',
      testMatch: ['**/tests/E2E/**/*.test.{ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/tests/E2E/fixtures/test-data.ts'],
    },
  ],
};
```

#### `frontend/jest.setup.ts`

```typescript
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

beforeAll(() => {
  console.log('🧪 Iniciando testes de frontend...');
});

afterAll(() => {
  console.log('✅ Testes de frontend finalizados');
});
```

#### `frontend/package.json`

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest --selectProjects unit",
    "test:integration": "jest --selectProjects integration",
    "test:e2e": "jest --selectProjects e2e",
    "test:all": "jest --selectProjects unit integration e2e",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand --watch"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "ts-jest": "^29.0.0"
  }
}
```

---

## 1️⃣ TESTES DE UNIDADE (Unity Tests)

### O que são?
Testes que verificam comportamento de **unidades isoladas** de código:
- Funções utilitárias
- Métodos de serviços
- Componentes simples sem dependências externas
- Lógica pura

### Objetivos
- ✅ Testar lógica isoladamente
- ✅ Rápidos (< 1s por teste)
- ✅ Determinísticos
- ✅ Fáceis de debugar

### Cobertura Obrigatória
- **100% de statements**
- **90%+ de branches**
- **100% de functions**
- **100% de lines**

---

### BACKEND - Testes de Unidade

#### Exemplo 1: Teste de Serviço com Mocks

```typescript
// tests/unity/services/user.service.unit.test.ts

import { UserService } from '@/modules/users/services/user.service';
import { IUserRepository } from '@/modules/users/repositories/user.repository.interface';
import { CreateUserDTO } from '@/modules/users/dtos/create-user.dto';
import { User } from '@/modules/users/models/user.model';

describe('UserService - Unit Tests', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    // Mock do repositório
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    // Instanciar serviço com mock
    userService = new UserService(mockUserRepository);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      // Arrange
      const createUserDTO: CreateUserDTO = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'SecurePassword123!',
      };

      const expectedUser: User = {
        id: '1',
        name: 'João Silva',
        email: 'joao@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.create.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.createUser(createUserDTO);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDTO);
      expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw error when email is invalid', async () => {
      // Arrange
      const createUserDTO: CreateUserDTO = {
        name: 'João Silva',
        email: 'invalid-email', // Email inválido
        password: 'SecurePassword123!',
      };

      // Act & Assert
      await expect(
        userService.createUser(createUserDTO)
      ).rejects.toThrow('Invalid email format');
    });

    it('should throw error when email already exists', async () => {
      // Arrange
      const createUserDTO: CreateUserDTO = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'SecurePassword123!',
      };

      mockUserRepository.findByEmail.mockResolvedValue({
        id: '2',
        name: 'Outro Usuário',
        email: 'joao@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act & Assert
      await expect(
        userService.createUser(createUserDTO)
      ).rejects.toThrow('Email already registered');
    });

    it('should throw error when password is weak', async () => {
      // Arrange
      const createUserDTO: CreateUserDTO = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: '123', // Senha fraca
      };

      // Act & Assert
      await expect(
        userService.createUser(createUserDTO)
      ).rejects.toThrow('Password does not meet security requirements');
    });
  });

  describe('getUserById', () => {
    it('should return user when exists', async () => {
      // Arrange
      const userId = '1';
      const expectedUser: User = {
        id: '1',
        name: 'João Silva',
        email: 'joao@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findById.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.getUserById(userId);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw error when user not found', async () => {
      // Arrange
      const userId = 'non-existent';
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        userService.getUserById(userId)
      ).rejects.toThrow('User not found');
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      // Arrange
      const userId = '1';
      const updateData = { name: 'Novo Nome' };
      const updatedUser: User = {
        id: '1',
        name: 'Novo Nome',
        email: 'joao@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.update.mockResolvedValue(updatedUser);

      // Act
      const result = await userService.updateUser(userId, updateData);

      // Assert
      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updateData);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      // Arrange
      const userId = '1';
      mockUserRepository.delete.mockResolvedValue(true);

      // Act
      const result = await userService.deleteUser(userId);

      // Assert
      expect(result).toBe(true);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
    });

    it('should throw error when user not found for deletion', async () => {
      // Arrange
      const userId = 'non-existent';
      mockUserRepository.delete.mockResolvedValue(false);

      // Act & Assert
      await expect(
        userService.deleteUser(userId)
      ).rejects.toThrow('User not found');
    });
  });
});
```

#### Exemplo 2: Teste de Utilitários

```typescript
// tests/unity/utils/validators.unit.test.ts

import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateCPF,
} from '@/utils/validators';

describe('Validators - Unit Tests', () => {
  describe('validateEmail', () => {
    it('should return true for valid email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@.com')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(' ')).toBe(false);
      expect(validateEmail(null as any)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return true for strong password', () => {
      expect(validatePassword('SecurePass123!')).toBe(true);
      expect(validatePassword('MyP@ssw0rd')).toBe(true);
    });

    it('should return false for weak password', () => {
      expect(validatePassword('123')).toBe(false); // Muito curto
      expect(validatePassword('password')).toBe(false); // Sem números
      expect(validatePassword('Password')).toBe(false); // Sem números/símbolos
      expect(validatePassword('PASSWORD123')).toBe(false); // Sem minúsculas
    });

    it('should validate minimum requirements', () => {
      // Mínimo 8 caracteres
      expect(validatePassword('Pass123!')).toBe(true);
      expect(validatePassword('Pass12!')).toBe(false);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate Brazilian phone numbers', () => {
      expect(validatePhoneNumber('11999999999')).toBe(true);
      expect(validatePhoneNumber('(11) 99999-9999')).toBe(true);
      expect(validatePhoneNumber('11 99999-9999')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhoneNumber('123')).toBe(false);
      expect(validatePhoneNumber('11911111111')).toBe(false); // Número genérico
    });
  });

  describe('validateCPF', () => {
    it('should validate valid CPF', () => {
      expect(validateCPF('11144477735')).toBe(true);
    });

    it('should reject invalid CPF', () => {
      expect(validateCPF('11111111111')).toBe(false);
      expect(validateCPF('123')).toBe(false);
      expect(validateCPF('000.000.000-00')).toBe(false);
    });
  });
});
```

#### Exemplo 3: Teste de Funções Puras

```typescript
// tests/unity/utils/formatters.unit.test.ts

import {
  formatCPF,
  formatPhone,
  formatCurrency,
  formatDate,
  truncateText,
} from '@/utils/formatters';

describe('Formatters - Unit Tests', () => {
  describe('formatCPF', () => {
    it('should format CPF correctly', () => {
      expect(formatCPF('11144477735')).toBe('111.444.777-35');
    });

    it('should handle invalid input', () => {
      expect(formatCPF('')).toBe('');
      expect(formatCPF('123')).toBe('123');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency in BRL', () => {
      expect(formatCurrency(1000)).toBe('R$ 1.000,00');
      expect(formatCurrency(1000.5)).toBe('R$ 1.000,50');
      expect(formatCurrency(0)).toBe('R$ 0,00');
    });

    it('should handle negative values', () => {
      expect(formatCurrency(-100)).toBe('R$ -100,00');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1000000)).toBe('R$ 1.000.000,00');
    });
  });

  describe('formatDate', () => {
    it('should format date in Brazilian format', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('15/01/2024');
    });

    it('should format with time', () => {
      const date = new Date('2024-01-15T14:30:00');
      expect(formatDate(date, true)).toBe('15/01/2024 14:30');
    });
  });

  describe('truncateText', () => {
    it('should truncate text with ellipsis', () => {
      const text = 'Lorem ipsum dolor sit amet';
      expect(truncateText(text, 10)).toBe('Lorem ipsu...');
    });

    it('should not truncate if text is shorter', () => {
      expect(truncateText('Hello', 10)).toBe('Hello');
    });
  });
});
```

---

### FRONTEND - Testes de Unidade

#### Exemplo 1: Teste de Componente Simples

```typescript
// tests/unity/components/Button.unit.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/Button';

describe('Button Component - Unit Tests', () => {
  describe('Rendering', () => {
    it('should render button with text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('should render with different variants', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-primary');

      rerender(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-secondary');
    });

    it('should render with different sizes', () => {
      const { rerender } = render(<Button size="small">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-small');

      rerender(<Button size="large">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-large');
    });
  });

  describe('Interactions', () => {
    it('should call onClick handler when clicked', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      const button = screen.getByRole('button');
      await userEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} disabled>
          Click
        </Button>
      );

      const button = screen.getByRole('button');
      await userEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('States', () => {
    it('should show loading state', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label when provided', () => {
      render(<Button aria-label="Submit form">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Submit form');
    });

    it('should be keyboard accessible', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      const button = screen.getByRole('button');
      button.focus();
      fireEvent.keyDown(button, { code: 'Space', key: ' ' });

      expect(handleClick).toHaveBeenCalled();
    });
  });
});
```

#### Exemplo 2: Teste de Hook

```typescript
// tests/unity/hooks/useForm.unit.test.ts

import { renderHook, act } from '@testing-library/react';
import { useForm } from '@/hooks/useForm';

describe('useForm Hook - Unit Tests', () => {
  describe('Form State', () => {
    it('should initialize with empty values', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '', email: '' },
        })
      );

      expect(result.current.values).toEqual({ name: '', email: '' });
    });

    it('should initialize with provided initial values', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: {
            name: 'João',
            email: 'joao@example.com',
          },
        })
      );

      expect(result.current.values).toEqual({
        name: 'João',
        email: 'joao@example.com',
      });
    });
  });

  describe('Field Handling', () => {
    it('should update field value', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
        })
      );

      act(() => {
        result.current.handleChange({
          target: { name: 'name', value: 'João' },
        } as any);
      });

      expect(result.current.values.name).toBe('João');
    });

    it('should reset form to initial values', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '', email: '' },
        })
      );

      act(() => {
        result.current.handleChange({
          target: { name: 'name', value: 'João' },
        } as any);
      });

      expect(result.current.values.name).toBe('João');

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.values).toEqual({ name: '', email: '' });
    });
  });

  describe('Form Validation', () => {
    it('should validate form on submit', async () => {
      const handleSubmit = jest.fn();
      const validate = jest.fn((values) => {
        const errors: any = {};
        if (!values.name) errors.name = 'Name is required';
        return errors;
      });

      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
          validate,
          onSubmit: handleSubmit,
        })
      );

      await act(async () => {
        await result.current.handleSubmit({
          preventDefault: jest.fn(),
        } as any);
      });

      expect(validate).toHaveBeenCalled();
      expect(handleSubmit).not.toHaveBeenCalled();
      expect(result.current.errors).toEqual({ name: 'Name is required' });
    });

    it('should call onSubmit when validation passes', async () => {
      const handleSubmit = jest.fn();
      const validate = jest.fn(() => ({}));

      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'João' },
          validate,
          onSubmit: handleSubmit,
        })
      );

      await act(async () => {
        await result.current.handleSubmit({
          preventDefault: jest.fn(),
        } as any);
      });

      expect(handleSubmit).toHaveBeenCalledWith({ name: 'João' });
    });
  });

  describe('Touched Fields', () => {
    it('should mark field as touched', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
        })
      );

      expect(result.current.touched.name).toBeFalsy();

      act(() => {
        result.current.handleBlur({
          target: { name: 'name' },
        } as any);
      });

      expect(result.current.touched.name).toBe(true);
    });
  });
});
```

#### Exemplo 3: Teste de Função Utilitária

```typescript
// tests/unity/utils/validators.unit.test.ts

import {
  validateEmail,
  validatePassword,
  validateURL,
} from '@/utils/validators';

describe('Frontend Validators - Unit Tests', () => {
  describe('validateEmail', () => {
    const validEmails = [
      'user@example.com',
      'user.name@example.co.uk',
      'user+tag@example.com',
    ];

    const invalidEmails = [
      'invalid',
      'user@',
      '@example.com',
      'user @example.com',
      '',
    ];

    validEmails.forEach(email => {
      it(`should validate ${email} as valid`, () => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    invalidEmails.forEach(email => {
      it(`should validate "${email}" as invalid`, () => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });

  describe('validatePassword', () => {
    it('should require minimum length', () => {
      expect(validatePassword('Pass1!')).toBe(false); // 6 chars
      expect(validatePassword('Pass12!')).toBe(false); // 7 chars
      expect(validatePassword('Pass123!')).toBe(true); // 8+ chars
    });

    it('should require uppercase letter', () => {
      expect(validatePassword('password123!')).toBe(false);
      expect(validatePassword('Password123!')).toBe(true);
    });

    it('should require number', () => {
      expect(validatePassword('Password!')).toBe(false);
      expect(validatePassword('Password1!')).toBe(true);
    });

    it('should require special character', () => {
      expect(validatePassword('Password123')).toBe(false);
      expect(validatePassword('Password123!')).toBe(true);
    });
  });

  describe('validateURL', () => {
    const validURLs = [
      'https://example.com',
      'http://www.example.com',
      'https://example.com/path',
    ];

    const invalidURLs = [
      'not a url',
      'example.com',
      'htp://example.com',
    ];

    validURLs.forEach(url => {
      it(`should validate ${url} as valid`, () => {
        expect(validateURL(url)).toBe(true);
      });
    });

    invalidURLs.forEach(url => {
      it(`should validate "${url}" as invalid`, () => {
        expect(validateURL(url)).toBe(false);
      });
    });
  });
});
```

---

## 2️⃣ TESTES DE INTEGRAÇÃO (Integration Tests)

### O que são?
Testes que verificam a **interação entre múltiplos componentes**:
- Serviço com Repository
- Página com múltiplos componentes
- API com banco de dados
- Múltiplos módulos trabalhando juntos

### Objetivos
- ✅ Testar fluxos integrados
- ✅ Verificar comunicação entre camadas
- ✅ Validar comportamento realista
- ✅ Detectar problemas de integração

### Cobertura Obrigatória
- **80%+ de statements**
- **75%+ de branches**
- **80%+ de functions**
- **80%+ de lines**

---

### BACKEND - Testes de Integração

#### Exemplo 1: Teste de Repositório com Banco de Dados

```typescript
// tests/integration/repositories/user.repository.integration.test.ts

import { UserRepository } from '@/modules/users/repositories/user.repository';
import { CreateUserDTO } from '@/modules/users/dtos/create-user.dto';
import { Database } from '@/config/database';

describe('UserRepository - Integration Tests', () => {
  let userRepository: UserRepository;
  let database: Database;

  beforeAll(async () => {
    // Conectar banco de dados de teste
    database = new Database({
      host: process.env.DB_TEST_HOST || 'localhost',
      port: parseInt(process.env.DB_TEST_PORT || '5432'),
      database: process.env.DB_TEST_NAME || 'test_db',
      username: process.env.DB_TEST_USER || 'test_user',
      password: process.env.DB_TEST_PASSWORD || 'test_password',
    });

    await database.connect();
    userRepository = new UserRepository(database);
  });

  afterAll(async () => {
    await database.disconnect();
  });

  beforeEach(async () => {
    // Limpar tabela antes de cada teste
    await database.query('DELETE FROM users');
  });

  describe('create', () => {
    it('should create user in database', async () => {
      // Arrange
      const createUserDTO: CreateUserDTO = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'SecurePass123!',
      };

      // Act
      const user = await userRepository.create(createUserDTO);

      // Assert
      expect(user.id).toBeDefined();
      expect(user.name).toBe('João Silva');
      expect(user.email).toBe('joao@example.com');

      // Verificar que foi salvo no banco
      const savedUser = await userRepository.findById(user.id);
      expect(savedUser).toEqual(user);
    });

    it('should throw error for duplicate email', async () => {
      // Arrange
      const createUserDTO: CreateUserDTO = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'SecurePass123!',
      };

      await userRepository.create(createUserDTO);

      // Act & Assert
      await expect(
        userRepository.create(createUserDTO)
      ).rejects.toThrow('Duplicate email');
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      // Arrange
      const user = await userRepository.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'SecurePass123!',
      });

      // Act
      const found = await userRepository.findById(user.id);

      // Assert
      expect(found).toEqual(user);
    });

    it('should return null when user not found', async () => {
      // Act
      const found = await userRepository.findById('non-existent-id');

      // Assert
      expect(found).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      // Arrange
      const user = await userRepository.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'SecurePass123!',
      });

      // Act
      const found = await userRepository.findByEmail('joao@example.com');

      // Assert
      expect(found?.id).toBe(user.id);
    });
  });

  describe('update', () => {
    it('should update user in database', async () => {
      // Arrange
      const user = await userRepository.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'SecurePass123!',
      });

      // Act
      const updated = await userRepository.update(user.id, {
        name: 'João da Silva',
      });

      // Assert
      expect(updated.name).toBe('João da Silva');

      // Verificar persistência
      const dbUser = await userRepository.findById(user.id);
      expect(dbUser?.name).toBe('João da Silva');
    });
  });

  describe('delete', () => {
    it('should delete user from database', async () => {
      // Arrange
      const user = await userRepository.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'SecurePass123!',
      });

      // Act
      await userRepository.delete(user.id);

      // Assert
      const found = await userRepository.findById(user.id);
      expect(found).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all users with pagination', async () => {
      // Arrange
      await userRepository.create({
        name: 'User 1',
        email: 'user1@example.com',
        password: 'Pass1!',
      });
      await userRepository.create({
        name: 'User 2',
        email: 'user2@example.com',
        password: 'Pass2!',
      });
      await userRepository.create({
        name: 'User 3',
        email: 'user3@example.com',
        password: 'Pass3!',
      });

      // Act
      const result = await userRepository.findAll({ page: 1, limit: 2 });

      // Assert
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
    });
  });
});
```

#### Exemplo 2: Teste de Serviço com Repositório Real

```typescript
// tests/integration/services/user.service.integration.test.ts

import { UserService } from '@/modules/users/services/user.service';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { EmailService } from '@/modules/email/services/email.service';
import { Database } from '@/config/database';

describe('UserService - Integration Tests', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let emailService: EmailService;
  let database: Database;

  beforeAll(async () => {
    database = new Database(/* config */);
    await database.connect();

    userRepository = new UserRepository(database);
    emailService = new EmailService(/* config */);
    userService = new UserService(userRepository, emailService);
  });

  afterAll(async () => {
    await database.disconnect();
  });

  beforeEach(async () => {
    await database.query('DELETE FROM users');
  });

  describe('User Registration Flow', () => {
    it('should register user and send welcome email', async () => {
      // Arrange
      const spy = jest.spyOn(emailService, 'sendWelcomeEmail');

      // Act
      const user = await userService.createUser({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'SecurePass123!',
      });

      // Assert
      expect(user.id).toBeDefined();
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'joao@example.com',
          name: 'João Silva',
        })
      );

      // Verificar que foi salvo
      const savedUser = await userRepository.findById(user.id);
      expect(savedUser).toBeDefined();
    });

    it('should not create user if email already exists', async () => {
      // Arrange
      await userService.createUser({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'SecurePass123!',
      });

      // Act & Assert
      await expect(
        userService.createUser({
          name: 'Outro Usuário',
          email: 'joao@example.com',
          password: 'Pass123!',
        })
      ).rejects.toThrow();
    });
  });

  describe('User Update Flow', () => {
    it('should update user and log activity', async () => {
      // Arrange
      const user = await userService.createUser({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'SecurePass123!',
      });

      const logSpy = jest.spyOn(userService, 'logUserActivity' as any);

      // Act
      const updated = await userService.updateUser(user.id, {
        name: 'João da Silva',
      });

      // Assert
      expect(updated.name).toBe('João da Silva');
      expect(logSpy).toHaveBeenCalledWith(
        user.id,
        'UPDATE_PROFILE'
      );
    });
  });
});
```

#### Exemplo 3: Teste de Middleware

```typescript
// tests/integration/middlewares/auth.middleware.integration.test.ts

import request from 'supertest';
import { app } from '@/app';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { TokenService } from '@/services/token.service';

describe('AuthMiddleware - Integration Tests', () => {
  let tokenService: TokenService;

  beforeAll(() => {
    tokenService = new TokenService();
  });

  describe('JWT Validation', () => {
    it('should allow request with valid token', async () => {
      // Arrange
      const token = tokenService.generateToken({ userId: '1' });

      // Act & Assert
      const response = await request(app)
        .get('/protected-route')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).not.toBe(401);
    });

    it('should reject request without token', async () => {
      // Act & Assert
      const response = await request(app)
        .get('/protected-route');

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Token required');
    });

    it('should reject request with invalid token', async () => {
      // Act & Assert
      const response = await request(app)
        .get('/protected-route')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid token');
    });

    it('should reject request with expired token', async () => {
      // Arrange
      const expiredToken = tokenService.generateToken(
        { userId: '1' },
        { expiresIn: '-1h' }
      );

      // Act & Assert
      const response = await request(app)
        .get('/protected-route')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Token expired');
    });
  });

  describe('Role-based Authorization', () => {
    it('should allow admin to access admin route', async () => {
      // Arrange
      const token = tokenService.generateToken({
        userId: '1',
        role: 'admin',
      });

      // Act & Assert
      const response = await request(app)
        .get('/admin/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).not.toBe(403);
    });

    it('should deny user access to admin route', async () => {
      // Arrange
      const token = tokenService.generateToken({
        userId: '2',
        role: 'user',
      });

      // Act & Assert
      const response = await request(app)
        .get('/admin/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });
});
```

---

### FRONTEND - Testes de Integração

#### Exemplo 1: Teste de Página com Múltiplos Componentes

```typescript
// tests/integration/pages/login.page.integration.test.tsx

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from '@/pages/LoginPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as apiService from '@/services/api.service';

jest.mock('@/services/api.service');

describe('LoginPage - Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    jest.clearAllMocks();
  });

  const renderLoginPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <LoginPage />
      </QueryClientProvider>
    );
  };

  describe('Form Rendering', () => {
    it('should render login form with all fields', () => {
      renderLoginPage();

      expect(
        screen.getByRole('textbox', { name: /email/i })
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/password/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /sign in/i })
      ).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors before submit', async () => {
      renderLoginPage();
      const user = userEvent.setup();

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for invalid email', async () => {
      renderLoginPage();
      const user = userEvent.setup();

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      await user.type(emailInput, 'invalid-email');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });
  });

  describe('Login Flow', () => {
    it('should login user successfully', async () => {
      (apiService.login as jest.Mock).mockResolvedValue({
        token: 'valid-token',
        user: { id: '1', email: 'user@example.com', name: 'João' },
      });

      renderLoginPage();
      const user = userEvent.setup();

      // Preencher formulário
      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'user@example.com');
      await user.type(passwordInput, 'ValidPass123!');
      await user.click(submitButton);

      // Aguardar requisição
      await waitFor(() => {
        expect(apiService.login).toHaveBeenCalledWith({
          email: 'user@example.com',
          password: 'ValidPass123!',
        });
      });

      // Verificar redirecionamento
      await waitFor(() => {
        expect(window.location.pathname).toBe('/dashboard');
      });
    });

    it('should show error on login failure', async () => {
      (apiService.login as jest.Mock).mockRejectedValue(
        new Error('Invalid credentials')
      );

      renderLoginPage();
      const user = userEvent.setup();

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'user@example.com');
      await user.type(passwordInput, 'WrongPassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/invalid credentials/i)
        ).toBeInTheDocument();
      });
    });

    it('should show loading state during login', async () => {
      (apiService.login as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      renderLoginPage();
      const user = userEvent.setup();

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'user@example.com');
      await user.type(passwordInput, 'ValidPass123!');
      await user.click(submitButton);

      // Verificar loading state
      expect(submitButton).toHaveAttribute('aria-busy', 'true');
      expect(submitButton).toBeDisabled();
    });
  });
});
```

#### Exemplo 2: Teste de Hook com Context

```typescript
// tests/integration/hooks/useAuth.integration.test.ts

import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { AuthProvider } from '@/context/AuthContext';
import * as apiService from '@/services/api.service';

jest.mock('@/services/api.service');

describe('useAuth Hook - Integration Tests', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Authentication State', () => {
    it('should restore user from localStorage on mount', async () => {
      // Arrange
      const user = { id: '1', email: 'user@example.com', name: 'João' };
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_token', 'valid-token');

      // Act
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Assert
      await waitFor(() => {
        expect(result.current.user).toEqual(user);
        expect(result.current.isAuthenticated).toBe(true);
      });
    });
  });

  describe('Login', () => {
    it('should login user and store token', async () => {
      (apiService.login as jest.Mock).mockResolvedValue({
        token: 'new-token',
        user: { id: '1', email: 'user@example.com', name: 'João' },
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login('user@example.com', 'Password123!');
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user?.email).toBe('user@example.com');
        expect(localStorage.getItem('auth_token')).toBe('new-token');
      });
    });

    it('should handle login error', async () => {
      (apiService.login as jest.Mock).mockRejectedValue(
        new Error('Invalid credentials')
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login('user@example.com', 'WrongPassword');
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.error).toContain('Invalid credentials');
      });
    });
  });

  describe('Logout', () => {
    it('should logout user and clear storage', async () => {
      // Arrange
      localStorage.setItem('auth_token', 'valid-token');
      localStorage.setItem('auth_user', JSON.stringify({
        id: '1',
        email: 'user@example.com',
      }));

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Act
      act(() => {
        result.current.logout();
      });

      // Assert
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });
});
```

---

## 3️⃣ TESTES E2E (End-to-End)

### O que são?
Testes que verificam o **fluxo completo da aplicação** do ponto de vista do usuário:
- Cenários reais de uso
- Múltiplas páginas/telas
- APIs reais (ou mockadas realistas)
- Dados persistidos em banco

### Objetivos
- ✅ Validar user journeys completos
- ✅ Detectar regressions visuais
- ✅ Simular comportamento real
- ✅ Aumentar confiança em deploy

### Cobertura Obrigatória
- **Todos os happy paths**
- **Cenários de erro principais**
- **Fluxos críticos do negócio**

### Ferramentas
- **Backend**: Supertest + dados reais de teste
- **Frontend**: Playwright ou Cypress

---

### BACKEND - Testes E2E

#### Exemplo 1: Teste E2E de Fluxo de Usuário

```typescript
// tests/E2E/users.e2e.test.ts

import request from 'supertest';
import { app } from '@/app';
import { Database } from '@/config/database';

describe('User E2E Tests', () => {
  let database: Database;
  let baseURL: string;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    baseURL = process.env.API_TEST_URL || 'http://localhost:3000';
    database = new Database(/* config */);
    await database.connect();
  });

  afterAll(async () => {
    await database.disconnect();
  });

  beforeEach(async () => {
    await database.query('DELETE FROM users');
  });

  describe('User Registration and Authentication Flow', () => {
    it('should complete full user registration flow', async () => {
      // Step 1: Registrar usuário
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'João Silva',
          email: 'joao@example.com',
          password: 'SecurePassword123!',
          passwordConfirm: 'SecurePassword123!',
        });

      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body.data.user).toHaveProperty('id');
      expect(registerResponse.body.data.user.email).toBe('joao@example.com');

      userId = registerResponse.body.data.user.id;

      // Step 2: Fazer login
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'joao@example.com',
          password: 'SecurePassword123!',
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.data).toHaveProperty('token');

      authToken = loginResponse.body.data.token;

      // Step 3: Acessar perfil protegido
      const profileResponse = await request(app)
        .get(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(profileResponse.status).toBe(200);
      expect(profileResponse.body.data.email).toBe('joao@example.com');

      // Step 4: Atualizar perfil
      const updateResponse = await request(app)
        .put(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'João da Silva Santos',
          phone: '11999999999',
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.data.name).toBe('João da Silva Santos');

      // Step 5: Fazer logout
      const logoutResponse = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${authToken}`);

      expect(logoutResponse.status).toBe(200);

      // Step 6: Verificar que token foi revogado
      const protectedResponse = await request(app)
        .get(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(protectedResponse.status).toBe(401);
    });
  });

  describe('User Management Workflow', () => {
    beforeEach(async () => {
      // Criar usuário admin
      const adminResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'AdminPass123!',
          passwordConfirm: 'AdminPass123!',
        });

      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'AdminPass123!',
        });

      authToken = loginResponse.body.data.token;
    });

    it('should list all users', async () => {
      // Criar alguns usuários
      for (let i = 1; i <= 5; i++) {
        await request(app)
          .post('/api/v1/auth/register')
          .send({
            name: `User ${i}`,
            email: `user${i}@example.com`,
            password: 'Password123!',
            passwordConfirm: 'Password123!',
          });
      }

      // Listar usuários
      const response = await request(app)
        .get('/api/v1/users?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.users).toHaveLength(6); // 5 + admin
      expect(response.body.data.total).toBe(6);
    });

    it('should filter users by email', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'João Silva',
          email: 'joao@example.com',
          password: 'Password123!',
          passwordConfirm: 'Password123!',
        });

      const response = await request(app)
        .get('/api/v1/users?search=joao@example.com')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.users).toHaveLength(1);
      expect(response.body.data.users[0].email).toBe('joao@example.com');
    });
  });

  describe('Error Handling', () => {
    it('should handle duplicate email registration', async () => {
      // Registrar primeiro usuário
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'João Silva',
          email: 'joao@example.com',
          password: 'Password123!',
          passwordConfirm: 'Password123!',
        });

      // Tentar registrar com mesmo email
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Outro Usuário',
          email: 'joao@example.com',
          password: 'Password123!',
          passwordConfirm: 'Password123!',
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toContain('Email already exists');
    });

    it('should handle invalid password on login', async () => {
      // Registrar usuário
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'João Silva',
          email: 'joao@example.com',
          password: 'CorrectPassword123!',
          passwordConfirm: 'CorrectPassword123!',
        });

      // Tentar login com senha errada
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'joao@example.com',
          password: 'WrongPassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Invalid credentials');
    });
  });
});
```

#### Exemplo 2: Teste E2E de Fluxo de Pedidos

```typescript
// tests/E2E/products.e2e.test.ts

import request from 'supertest';
import { app } from '@/app';

describe('Product Purchase E2E Tests', () => {
  let authToken: string;
  let userId: string;
  let productId: string;
  let cartId: string;

  beforeAll(async () => {
    // Setup: Registrar e fazer login
    const registerResponse = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Customer',
        email: 'customer@example.com',
        password: 'Password123!',
        passwordConfirm: 'Password123!',
      });

    userId = registerResponse.body.data.user.id;

    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'customer@example.com',
        password: 'Password123!',
      });

    authToken = loginResponse.body.data.token;
  });

  it('should complete purchase flow', async () => {
    // Step 1: Listar produtos
    const productsResponse = await request(app)
      .get('/api/v1/products?page=1&limit=10');

    expect(productsResponse.status).toBe(200);
    productId = productsResponse.body.data.products[0].id;

    // Step 2: Visualizar detalhes do produto
    const productDetailResponse = await request(app)
      .get(`/api/v1/products/${productId}`);

    expect(productDetailResponse.status).toBe(200);
    const product = productDetailResponse.body.data;

    // Step 3: Criar carrinho
    const cartResponse = await request(app)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        productId,
        quantity: 2,
      });

    expect(cartResponse.status).toBe(201);
    cartId = cartResponse.body.data.id;

    // Step 4: Adicionar item ao carrinho (novo item)
    const addItemResponse = await request(app)
      .post(`/api/v1/cart/${cartId}/items`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        productId,
        quantity: 1,
      });

    expect(addItemResponse.status).toBe(200);
    expect(addItemResponse.body.data.items).toHaveLength(1);

    // Step 5: Visualizar carrinho
    const viewCartResponse = await request(app)
      .get(`/api/v1/cart/${cartId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(viewCartResponse.status).toBe(200);

    // Step 6: Aplicar cupom de desconto
    const couponResponse = await request(app)
      .post(`/api/v1/cart/${cartId}/apply-coupon`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        couponCode: 'WELCOME10',
      });

    expect(couponResponse.status).toBe(200);

    // Step 7: Realizar checkout
    const checkoutResponse = await request(app)
      .post('/api/v1/orders/checkout')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        cartId,
        shippingAddress: {
          street: 'Rua A',
          number: '123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01310-100',
        },
        paymentMethod: 'credit_card',
      });

    expect(checkoutResponse.status).toBe(201);
    const orderId = checkoutResponse.body.data.order.id;

    // Step 8: Visualizar pedido
    const orderResponse = await request(app)
      .get(`/api/v1/orders/${orderId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(orderResponse.status).toBe(200);
    expect(orderResponse.body.data.status).toBe('PENDING_PAYMENT');

    // Step 9: Processar pagamento
    const paymentResponse = await request(app)
      .post(`/api/v1/orders/${orderId}/payment`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        paymentMethod: 'credit_card',
        cardToken: 'tok_valid_card',
      });

    expect(paymentResponse.status).toBe(200);

    // Step 10: Verificar status do pedido
    const finalOrderResponse = await request(app)
      .get(`/api/v1/orders/${orderId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(finalOrderResponse.status).toBe(200);
    expect(finalOrderResponse.body.data.status).toBe('CONFIRMED');
  });
});
```

---

### FRONTEND - Testes E2E

#### Configurar Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

#### `frontend/playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/E2E',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### Exemplo 1: Teste E2E de Autenticação

```typescript
// tests/E2E/auth.e2e.test.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication E2E Tests', () => {
  test('should complete registration and login flow', async ({ page }) => {
    // Ir para página de registro
    await page.goto('/auth/register');

    // Preencher formulário de registro
    await page.fill('input[name="name"]', 'João Silva');
    await page.fill('input[name="email"]', 'joao@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.fill('input[name="passwordConfirm"]', 'SecurePass123!');

    // Submeter formulário
    await page.click('button[type="submit"]');

    // Aguardar redirecionamento para login
    await page.waitForURL('/auth/login');
    expect(page.url()).toContain('/auth/login');

    // Preencher formulário de login
    await page.fill('input[name="email"]', 'joao@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');

    // Submeter formulário
    await page.click('button[type="submit"]');

    // Aguardar redirecionamento para dashboard
    await page.waitForURL('/dashboard');
    expect(page.url()).toContain('/dashboard');

    // Verificar que usuário está autenticado
    const userMenu = page.locator('[data-testid="user-menu"]');
    await expect(userMenu).toContainText('João Silva');
  });

  test('should show validation errors on invalid registration', async ({ page }) => {
    await page.goto('/auth/register');

    // Clicar no botão submit sem preencher formulário
    await page.click('button[type="submit"]');

    // Verificar mensagens de erro
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should show error for duplicate email', async ({ page }) => {
    // Tentar registrar com email que já existe
    await page.goto('/auth/register');

    await page.fill('input[name="name"]', 'Another User');
    await page.fill('input[name="email"]', 'joao@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.fill('input[name="passwordConfirm"]', 'SecurePass123!');

    await page.click('button[type="submit"]');

    // Verificar mensagem de erro
    await expect(
      page.locator('text=Email already registered')
    ).toBeVisible();
  });
});
```

#### Exemplo 2: Teste E2E de Fluxo de Compra

```typescript
// tests/E2E/user-flow.e2e.test.ts

import { test, expect } from '@playwright/test';

test.describe('User Shopping Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada teste
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'customer@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should complete purchase flow', async ({ page }) => {
    // Ir para página de produtos
    await page.goto('/products');

    // Verificar que produtos são carregados
    await page.waitForSelector('[data-testid="product-card"]');
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards).toHaveCount(20); // Exemplo: 20 produtos por página

    // Clicar no primeiro produto
    await page.click('[data-testid="product-card"]:first-child');

    // Aguardar página de detalhes
    await page.waitForURL('/products/*');

    // Adicionar ao carrinho
    await page.click('button[data-testid="add-to-cart"]');

    // Verificar notificação de sucesso
    await expect(
      page.locator('text=Added to cart successfully')
    ).toBeVisible();

    // Ir para carrinho
    await page.click('[data-testid="cart-icon"]');
    await page.waitForURL('/cart');

    // Verificar item no carrinho
    const cartItems = page.locator('[data-testid="cart-item"]');
    await expect(cartItems).toHaveCount(1);

    // Prosseguir para checkout
    await page.click('button[data-testid="checkout-button"]');
    await page.waitForURL('/checkout');

    // Preencher endereço de entrega
    await page.fill('input[name="street"]', 'Rua A');
    await page.fill('input[name="number"]', '123');
    await page.fill('input[name="city"]', 'São Paulo');
    await page.fill('input[name="zipCode"]', '01310-100');

    // Prosseguir para pagamento
    await page.click('button[data-testid="next-payment"]');
    await page.waitForURL('/checkout/payment');

    // Preencher dados de cartão (teste com dados fictícios)
    const frameLocator = page.frameLocator('iframe[name="payment-iframe"]');
    await frameLocator.locator('input[name="cardnumber"]').fill('4111111111111111');
    await frameLocator.locator('input[name="expiry"]').fill('12/25');
    await frameLocator.locator('input[name="cvc"]').fill('123');

    // Finalizar compra
    await page.click('button[data-testid="place-order"]');

    // Aguardar redirecionamento para confirmação
    await page.waitForURL('/order-confirmation/*');

    // Verificar mensagem de sucesso
    await expect(
      page.locator('text=Order placed successfully')
    ).toBeVisible();

    // Verificar número do pedido
    const orderNumber = page.locator('[data-testid="order-number"]');
    await expect(orderNumber).toBeVisible();
  });

  test('should apply discount code', async ({ page }) => {
    await page.goto('/cart');

    // Adicionar item ao carrinho (via API ou UI)
    // ...

    // Preencher código de desconto
    await page.fill('input[data-testid="discount-code"]', 'WELCOME10');
    await page.click('button[data-testid="apply-discount"]');

    // Verificar que desconto foi aplicado
    await expect(
      page.locator('text=Discount applied')
    ).toBeVisible();

    // Verificar valor atualizado
    const discount = page.locator('[data-testid="discount-amount"]');
    await expect(discount).toContainText('-R$');
  });

  test('should handle payment errors gracefully', async ({ page }) => {
    await page.goto('/checkout/payment');

    // Preencher dados de cartão inválido
    const frameLocator = page.frameLocator('iframe[name="payment-iframe"]');
    await frameLocator.locator('input[name="cardnumber"]').fill('4000000000000002'); // Cartão que simula erro
    await frameLocator.locator('input[name="expiry"]').fill('12/25');
    await frameLocator.locator('input[name="cvc"]').fill('123');

    // Tentar finalizar compra
    await page.click('button[data-testid="place-order"]');

    // Verificar mensagem de erro
    await expect(
      page.locator('text=Payment failed')
    ).toBeVisible();

    // Verificar que usuário pode tentar novamente
    const cardInput = frameLocator.locator('input[name="cardnumber"]');
    await expect(cardInput).toBeEmpty();
  });
});
```

---

## 📊 RELATÓRIO DE COBERTURA

### Como Gerar

```bash
# Backend
npm run test:coverage

# Frontend
npm run test:coverage
```

### Arquivo `coverage-summary.json`

O relatório será gerado automaticamente em `coverage/coverage-summary.json` com métricas:

```json
{
  "total": {
    "lines": { "total": 1000, "covered": 980, "skipped": 0, "pct": 98 },
    "statements": { "total": 1050, "covered": 1030, "skipped": 0, "pct": 98.1 },
    "functions": { "total": 200, "covered": 200, "skipped": 0, "pct": 100 },
    "branches": { "total": 300, "covered": 285, "skipped": 0, "pct": 95 }
  }
}
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Para Toda Nova Funcionalidade

**Antes de fazer Commit:**
- [ ] Testes de unidade escrit os (100% coverage das funções)
- [ ] Testes de integração escritos (80%+ coverage)
- [ ] Testes E2E escritos (todos os happy paths)
- [ ] Todos os testes passam localmente
- [ ] Coverage ≥ 95%
- [ ] Sem console.log() ou código de debug nos testes
- [ ] Mocks bem estruturados
- [ ] Fixtures reutilizáveis criadas

**Antes de fazer Deploy:**
- [ ] CI/CD roda todos os testes com sucesso
- [ ] Coverage report gerado
- [ ] Sem testes ignorados (`.skip`, `.only`)
- [ ] Testes nomeados descritivamente
- [ ] Performance dos testes < 5 minutos total

### Métricas Obrigatórias

```yaml
Unity Tests:
  Statements: 100%
  Branches: 90%
  Functions: 100%
  Lines: 100%

Integration Tests:
  Statements: 80%+
  Branches: 75%+
  Functions: 80%+
  Lines: 80%+

E2E Tests:
  Happy paths: 100%
  Error scenarios: 80%+
  Critical flows: 100%
```

---

## 🚀 SCRIPTS NPM

### Backend

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch --onlyChanged",
    "test:coverage": "jest --coverage --coverageReporters=text --coverageReporters=html",
    "test:unit": "jest --selectProjects unit",
    "test:integration": "jest --selectProjects integration --runInBand",
    "test:e2e": "jest --selectProjects e2e --runInBand",
    "test:all": "jest --selectProjects unit integration e2e --runInBand",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

### Frontend

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch --onlyChanged",
    "test:coverage": "jest --coverage --coverageReporters=text --coverageReporters=html",
    "test:unit": "jest --selectProjects unit",
    "test:integration": "jest --selectProjects integration",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:all": "jest && playwright test",
    "test:ci": "jest --ci --coverage && playwright test"
  }
}
```

---

## 📚 REFERÊNCIAS

### Leitura Recomendada
- **"Test Driven Development" - Kent Beck**
- **"Working Effectively with Legacy Code" - Michael Feathers**
- **"The Art of Software Testing" - Glenford Myers**

### Documentação Oficial
- Jest: https://jestjs.io/
- React Testing Library: https://testing-library.com/react
- Playwright: https://playwright.dev/
- Supertest: https://github.com/visionmedia/supertest

---

## 🎯 CONCLUSÃO

Seguir este guia resultará em:
- ✅ **Alta Confiança** no código
- ✅ **Menos Bugs** em produção
- ✅ **Refatorações Seguras**
- ✅ **Documentação Viva**
- ✅ **Velocidade Sustentável**

**Lembre-se: Testar é investir no futuro do projeto.**

---

**Última atualização:** 2024
**Versão:** 1.0
**Responsável:** QA e Arquitetura do Projeto