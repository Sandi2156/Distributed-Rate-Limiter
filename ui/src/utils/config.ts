// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
} as const;

// Auth Configuration
export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  TOKEN_EXPIRY_KEY: 'token_expiry',
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'Distributed Rate Limiter',
  VERSION: '1.0.0',
  ENVIRONMENT: import.meta.env.MODE || 'development',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG_MODE: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// UI Configuration
export const UI_CONFIG = {
  THEME: {
    PRIMARY_COLOR: '#3b82f6',
    SECONDARY_COLOR: '#64748b',
    SUCCESS_COLOR: '#10b981',
    ERROR_COLOR: '#ef4444',
    WARNING_COLOR: '#f59e0b',
  },
  ANIMATION_DURATION: 300, // milliseconds
} as const; 