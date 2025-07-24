import {
  LoginRequest,
  LoginResponse,
  AuthStatus,
  PingResponse,
  SchemaResponse,
  IngestersResponse,
  DatabaseStatus,
  CacheStatus
} from '../types/api';

const API_BASE_URL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:40004'
    : 'http://localhost:40004';

// HTTP client class
export class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;

    // Load auth token from localStorage if available
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('chomp_auth_token');
    }
  }

  // Update base URL dynamically
  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Get current base URL
  getBaseUrl(): string {
    return this.baseUrl;
  }

  // Set auth token
  setAuthToken(token: string | null) {
    this.authToken = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('chomp_auth_token', token);
      } else {
        localStorage.removeItem('chomp_auth_token');
      }
    }
  }

  // Get headers with auth token
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  // Generic request method
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Use /auth/direct endpoint for all authentication methods
    const response = await this.post<{
      access_token?: string;
      user_id?: string;
      expires_hours?: number;
    }>('/auth/direct', {
      auth_method: credentials.auth_method,
      credentials: {
        token: credentials.token
      }
    });

    if (response.access_token) {
      this.setAuthToken(response.access_token);
      // Transform backend response to match frontend expectations
      return {
        success: true,
        jwt_token: response.access_token,
        message: 'Authentication successful',
        user_id: response.user_id || 'authenticated_user',
        expires_hours: response.expires_hours || 24
      };
    }

    return {
      success: false,
      jwt_token: '',
      message: 'Authentication failed',
      user_id: '',
      expires_hours: 0
    };
  }

  async logout(): Promise<void> {
    try {
      await this.post('/auth/logout');
    } finally {
      this.setAuthToken(null);
    }
  }

  async checkAuthStatus(): Promise<AuthStatus> {
    return this.get<AuthStatus>('/auth/status');
  }

  // System methods
  async ping(): Promise<PingResponse> {
    return this.get<PingResponse>('/ping');
  }

  async getSchema(): Promise<SchemaResponse> {
    return this.get<SchemaResponse>('/schema');
  }

  // Admin methods
  async getIngesters(): Promise<IngestersResponse> {
    return this.get<IngestersResponse>('/admin/ingesters');
  }

  async getDatabaseStatus(): Promise<DatabaseStatus> {
    return this.get<DatabaseStatus>('/admin/database/status');
  }

  async getCacheStatus(): Promise<CacheStatus> {
    return this.get<CacheStatus>('/admin/cache/status');
  }

  // Data methods
  async getLastData(resource?: string): Promise<unknown> {
    const endpoint = resource ? `/last/${resource}` : '/last';
    return this.get(endpoint);
  }

  async getHistoricalData(
    resource: string,
    params: Record<string, unknown> = {}
  ): Promise<unknown> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/history/${resource}${queryString ? `?${queryString}` : ''}`;

    return this.get(endpoint);
  }

  async getAnalysis(
    type: 'volatility' | 'trend' | 'momentum' | 'oprange',
    resource: string,
    params: Record<string, unknown> = {}
  ): Promise<unknown> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/${type}/${resource}${queryString ? `?${queryString}` : ''}`;

    return this.get(endpoint);
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();
