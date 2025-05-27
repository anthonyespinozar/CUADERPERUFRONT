const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const API_URL = API_BASE_URL;
export const API_URL_WITH_PREFIX = `${API_BASE_URL}/api`;

export const APP_ROUTES = {
  public: {
    login: '/login',
    register: '/register'
  },
  private: {
    dashboard: '/dashboard',
    profile: '/profile'
  }
};

export const UNAUTHORIZED_ROUTES = [
  '/login',
  '/register'
];

const environment = {
  api: {
    baseUrl: API_URL_WITH_PREFIX,
    timeout: 30000,
    retryAttempts: 3,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },
  auth: {
    tokenExpirationHours: 8,
    storageKeys: {
      token: 'token',
      tokenExpiresAt: 'token_expires_at',
      user: 'user'
    }
  }
};

export default environment; 