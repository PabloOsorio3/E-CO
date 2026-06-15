import { toast } from 'sonner';

export const showInfoAlert = (message: string) => {
    toast.warning(message, {
        description: new Date().toLocaleString(),
        duration: 4000,
    });
};
