import { API_CONFIG, AUTH_CONFIG } from '@/utils/config';

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: any;
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      // Store token in localStorage if provided
      if (result.token) {
        localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, result.token);
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService(); 