export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export const apiClient = {
  async get<T = unknown>(url: string): Promise<T> {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const json = (await res.json()) as ApiResponse<T>;
    
    if (!json.success) {
      throw new Error(json.error?.message || 'An error occurred during the request.');
    }
    
    return json.data;
  },

  async post<T = unknown>(url: string, body?: unknown): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    
    const json = (await res.json()) as ApiResponse<T>;
    
    if (!json.success) {
      throw new Error(json.error?.message || 'An error occurred during the request.');
    }
    
    return json.data;
  },

  async patch<T = unknown>(url: string, body?: unknown): Promise<T> {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    
    const json = (await res.json()) as ApiResponse<T>;
    
    if (!json.success) {
      throw new Error(json.error?.message || 'An error occurred during the request.');
    }
    
    return json.data;
  },

  async delete<T = unknown>(url: string): Promise<T> {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const json = (await res.json()) as ApiResponse<T>;
    
    if (!json.success) {
      throw new Error(json.error?.message || 'An error occurred during the request.');
    }
    
    return json.data;
  },
};
