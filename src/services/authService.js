import environment from '@/config/environment';

class AuthService {
  getToken() {
    try {
      return localStorage.getItem('token');
    } catch {
      return null;
    }
  }

  getUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return !!token && !!user && user.activo === true;
  }

  async login(credentials) {
    const response = await fetch(`${environment.url_backend}/api/auth/login`, {
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
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    // Guardar datos en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return {
      message: data.message,
      token: data.token,
      user: data.user
    };
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

export const authService = new AuthService(); 