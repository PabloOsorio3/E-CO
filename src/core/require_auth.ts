import { getCurrentToken } from './current_user';
import { showInfoAlert } from '../alerts/info/info-alert';

export const requireCustomerAuth = (redirectToLogin: () => void): boolean => {
    if (getCurrentToken()) return true;
    showInfoAlert('Iniciá sesión para continuar');
    redirectToLogin();
    return false;
};
