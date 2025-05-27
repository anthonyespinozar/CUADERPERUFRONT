import { API_URL_WITH_PREFIX } from '@/config/environment';

class AuthService {
  getToken() {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem('token');
    } catch {
      return null;
    }
  }

  setToken(token) {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  }

  setUser(user) {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user:', error);
    }
  }

  getUser() {
    try {
      if (typeof window === 'undefined') return null;
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      this.logout();
      return null;
    }
  }

  isAuthenticated() {
    try {
      if (typeof window === 'undefined') return false;
      const token = this.getToken();
      const user = this.getUser();
      return !!token && !!user;
    } catch {
      return false;
    }
  }

  async login(credentials) {
    try {
      const response = await fetch(`${API_URL_WITH_PREFIX}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: credentials.email,
          password: credentials.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      if (!data.token || !data.user) {
        throw new Error('Respuesta del servidor inválida');
      }

      // Normalizar el rol para que coincida con nuestras constantes
      const normalizedUser = {
        ...data.user,
        rol: data.user.rol.toUpperCase()
      };

      this.setToken(data.token);
      this.setUser(normalizedUser);
      return { user: normalizedUser, token: data.token };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  }

  logout() {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}

export const authService = new AuthService(); 