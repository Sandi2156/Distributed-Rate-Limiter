import { API_CONFIG } from '@/utils/config';

export interface ApiRegistration {
  _id: string;
  name: string;
  endpointUrl: string;
  rateLimitAlgorithm: {
    name: string;
    _id: string;
    description?: string;
  };
  config?: {
    windowSeconds?: number;
    requests?: number;
  };
  createdAt?: string;
}

export interface ApiRegistrationResponse {
  registrations: ApiRegistration[];
}

export interface ApiRegistrationDetailResponse {
  registration: ApiRegistration;
}

export interface CreateApiRequest {
  apiUrl: string;
  name: string;
  algorithmId: string;
  config: Record<string, any>;
}

export interface UpdateApiRequest {
  name?: string;
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  rateLimit?: number;
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getApis(): Promise<ApiRegistrationResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/registrations`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch APIs');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getApiDetails(id: string): Promise<ApiRegistrationDetailResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/registrations/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch API details');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async createApi(data: CreateApiRequest): Promise<ApiRegistration> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/register`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create API');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async updateApi(id: string, data: UpdateApiRequest): Promise<ApiRegistration> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/registrations/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update API');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async deleteApi(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/registrations/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete API');
      }
    } catch (error) {
      throw error;
    }
  }
}

export const apiService = new ApiService(); 