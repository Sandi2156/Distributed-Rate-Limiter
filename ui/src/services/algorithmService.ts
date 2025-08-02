import { API_CONFIG } from '@/utils/config';

export interface Algorithm {
  _id: string;
  name: string;
  description: string;
}

export interface AlgorithmResponse {
  algorithms: Algorithm[];
}

class AlgorithmService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getAlgorithms(): Promise<AlgorithmResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/algorithms`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch algorithms');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export const algorithmService = new AlgorithmService(); 