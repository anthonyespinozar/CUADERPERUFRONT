const environment = {
  // URL del backend - usa la variable de entorno o un valor por defecto
  url_backend: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/api',
  
  // Configuración de autenticación
  auth: {
    tokenExpirationHours: 8,
    storageKeys: {
      token: 'token',
      tokenExpiresAt: 'token_expires_at',
      user: 'user'
    }
  },

  // Otras configuraciones que podrías necesitar
  api: {
    timeout: 30000, // timeout en milisegundos
    retryAttempts: 3,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
};

export default environment; 