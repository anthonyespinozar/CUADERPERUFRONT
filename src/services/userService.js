import { CrudService } from './crudService';

class UserService extends CrudService {
  constructor() {
    super('/users'); // El endpoint para usuarios
  }

  // Aquí puedes agregar métodos específicos para usuarios
  async changePassword(userId, passwordData) {
    try {
      const response = await this.api.post(`${this.endpoint}/${userId}/change-password`, passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al cambiar la contraseña');
    }
  }
}

export const userService = new UserService(); 