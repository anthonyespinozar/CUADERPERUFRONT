import environment from '@/config/environment';

const { auth: { tokenExpirationHours, storageKeys } } = environment;

export const authService = {
  setToken(token) {
    if (!token) return;
    // Guardar la fecha de expiración (usando la configuración)
    const expiresAt = new Date().getTime() + (tokenExpirationHours * 60 * 60 * 1000);
    localStorage.setItem(storageKeys.token, token);
    localStorage.setItem(storageKeys.tokenExpiresAt, expiresAt.toString());
  },

  getToken() {
    const token = localStorage.getItem(storageKeys.token);
    const expiresAt = localStorage.getItem(storageKeys.tokenExpiresAt);
    
    if (!token || !expiresAt) return null;
    
    // Verificar si el token ha expirado
    const now = new Date().getTime();
    if (now > parseInt(expiresAt)) {
      this.removeToken();
      return null;
    }
    
    return token;
  },

  removeToken() {
    localStorage.removeItem(storageKeys.token);
    localStorage.removeItem(storageKeys.tokenExpiresAt);
  },

  setUser(user) {
    if (!user) return;
    localStorage.setItem(storageKeys.user, JSON.stringify(user));
  },

  getUser() {
    const user = localStorage.getItem(storageKeys.user);
    return user ? JSON.parse(user) : null;
  },

  removeUser() {
    localStorage.removeItem(storageKeys.user);
  },

  isAuthenticated() {
    return !!this.getToken() && !!this.getUser();
  },

  async login(credentials) {
    try {
      const response = await fetch(`${environment.url_backend}/auth/login`, {
        method: 'POST',
        headers: environment.api.headers,
        body: JSON.stringify({
          correo: credentials.correo,
          password: credentials.password
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Usar el mensaje de error del backend si está disponible
        throw new Error(errorData.error || `Error en el servidor: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Verificar que la respuesta tenga el formato esperado
      if (!data.token || !data.user) {
        throw new Error('Respuesta del servidor inválida');
      }

      // Guardar el token y los datos del usuario
      this.setToken(data.token);
      this.setUser(data.user);
      
      return {
        token: data.token,
        user: data.user,
        message: data.message
      };
    } catch (error) {
      console.error("Error en login:", error);
      if (error.message.includes('Failed to fetch')) {
        throw new Error('No se pudo conectar con el servidor. Por favor, verifica que el servidor esté en ejecución.');
      }
      throw error; // Lanzar el error original para mantener el mensaje del backend
    }
  },

  logout() {
    this.removeToken();
    this.removeUser();
    window.location.href = '/login';
  }
};

export default authService;