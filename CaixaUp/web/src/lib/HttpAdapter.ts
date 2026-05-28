import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from './api';

export class HttpClientAdapter {
  constructor(private client: AxiosInstance) {}

  private normalizeResponse<T>(response: AxiosResponse): AxiosResponse<ApiResponse<T>> {
    const rawData = response.data;
    let normalizedData: ApiResponse<T>;

    if (
      rawData &&
      typeof rawData === 'object' &&
      'success' in rawData &&
      'data' in rawData &&
      'message' in rawData
    ) {
      // Already normalized
      normalizedData = rawData as ApiResponse<T>;
    } else {
      // Need to adapt based on backend structure
      if (Array.isArray(rawData)) {
        // e.g. GET all returns array directly
        normalizedData = {
          success: true,
          data: rawData as unknown as T,
          message: 'Success',
        };
      } else if (rawData && typeof rawData === 'object' && 'data' in rawData && 'message' in rawData) {
        // e.g. POST create returns { message, data }
        normalizedData = {
          success: true,
          data: rawData.data as T,
          message: rawData.message as string,
        };
      } else if (rawData && typeof rawData === 'object' && 'message' in rawData && !('data' in rawData)) {
        // e.g. PUT/DELETE returns { message }
        normalizedData = {
          success: true,
          data: null as unknown as T,
          message: rawData.message as string,
        };
      } else {
        // e.g. GET by id returns object directly
        normalizedData = {
          success: true,
          data: rawData as T,
          message: 'Success',
        };
      }
    }

    // Mutate the original response to keep status, headers, etc.
    response.data = normalizedData;
    return response as AxiosResponse<ApiResponse<T>>;
  }

  private handleError(error: any): never {
    // Sanitize technical errors missed by the interceptor
    if (error.response) {
      const msg = error.response.data?.message || error.friendlyMessage;
      if (
        typeof msg === 'string' &&
        (msg.includes('Illegal arguments') ||
          msg.includes('undefined') ||
          msg.includes('null') ||
          msg.includes('Cannot read properties'))
      ) {
        error.friendlyMessage = 'Ocorreu um erro interno no servidor. Verifique os dados e tente novamente.';
      }
    } else if (!error.friendlyMessage) {
      error.friendlyMessage = 'Erro de conexão com o servidor. Verifique sua rede e tente novamente.';
    }
    throw error;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    try {
      const response = await this.client.get(url, config);
      return this.normalizeResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    try {
      const response = await this.client.post(url, data, config);
      return this.normalizeResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    try {
      const response = await this.client.put(url, data, config);
      return this.normalizeResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    try {
      const response = await this.client.delete(url, config);
      return this.normalizeResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
}
