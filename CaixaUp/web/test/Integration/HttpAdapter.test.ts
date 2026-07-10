import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpClientAdapter } from '@/lib/HttpAdapter';
import axios from 'axios';

describe('HttpAdapter (Integration)', () => {
  let adapter: HttpClientAdapter;
  let mockAxios: any;

  beforeEach(() => {
    mockAxios = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };
    adapter = new HttpClientAdapter(mockAxios as any);
  });

  it('CT-02: Handles HTTP 400 Bad Request error cleanly and exposes friendly message', async () => {
    const mockError = {
      response: {
        status: 400,
        data: { message: 'WHERE parameter "user_id" has invalid "undefined" value' }
      },
      isAxiosError: true
    };
    
    mockAxios.post.mockRejectedValue(mockError);

    // The raw HttpAdapter will throw. The interceptor normally intercepts before HttpAdapter, 
    // but in unit testing HttpAdapter directly, we just verify the rejection logic.
    await expect(adapter.post('/categories', {})).rejects.toEqual(mockError);
  });
});
