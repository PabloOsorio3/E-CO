import { toast } from 'sonner';

export const showErrorAlert = (message: string) => {
  toast.error(message, {
    description: 'Ocurrió un error inesperado. Inténtalo de nuevo.',
    duration: 5000,
  });
};
