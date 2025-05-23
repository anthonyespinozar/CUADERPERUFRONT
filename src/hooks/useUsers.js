import { useCrud } from './useCrud';
import { userService } from '@/services/userService';
import { toast } from 'sonner';

export const useUsers = () => {
  const crudMethods = useCrud(userService);

  // Aquí puedes agregar métodos específicos para usuarios
  const changePassword = async (userId, passwordData) => {
    try {
      await userService.changePassword(userId, passwordData);
      toast.success('Contraseña actualizada exitosamente');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  return {
    ...crudMethods,
    changePassword,
  };
}; 