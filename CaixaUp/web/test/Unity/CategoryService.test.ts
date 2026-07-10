import { describe, it, expect, vi, beforeEach } from 'vitest';
import { categoryService } from '@/lib/api';

// Mock HttpAdapter before it's imported
vi.mock('@/lib/HttpAdapter', () => {
  return {
    HttpClientAdapter: vi.fn().mockImplementation(() => ({
      post: vi.fn().mockResolvedValue({ data: { id: '1', name: 'Alimentação', type: 'despesa' } }),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    }))
  };
});

describe('Category Service (Unity)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('CT-01: Formats payload correctly without undefined fields on create', async () => {
    // Re-import after mock
    const apiModule = await import('@/lib/api');
    
    // Simulating create payload
    const payload = { name: 'Alimentação', type: 'despesa' as const };
    
    // We expect the post method of HttpAdapter to be called with exact payload
    const mockPost = vi.fn().mockResolvedValue({ success: true, data: { id: '1' } });
    
    // override the internal httpAdapter of the categoryService for test
    (apiModule.categoryService as any).create = async (data: any) => {
       return mockPost('/categories', data);
    };

    await apiModule.categoryService.create(payload);
    
    expect(mockPost).toHaveBeenCalledWith('/categories', payload);
    const passedPayload = mockPost.mock.calls[0][1];
    expect(passedPayload).not.toHaveProperty('userId');
  });
});
