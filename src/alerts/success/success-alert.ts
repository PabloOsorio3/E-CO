import { toast } from 'sonner';

export const showSuccessAlert = (message: string) => {
  toast.success(message, {
    description: new Date().toLocaleString(),
    duration: 4000,
  });
};
