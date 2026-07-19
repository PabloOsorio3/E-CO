import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "jwt-decode";

interface AppJwtPayload extends JwtPayload {
    id_user?: number;
    type_user_id?: number;
    email?: string;
    full_name?: string;
}

export const getCurrentToken = () => {
    return localStorage.getItem('token');
}

export const getCurrentUser = (): AppJwtPayload | null => {
    const token = getCurrentToken();
    if (token) {
        return jwtDecode<AppJwtPayload>(token);
    }
    return null;
}

export const getCurrentRole = () => {
    const user = getCurrentUser();
    return user?.type_user_id;
}

export const setToken = (token: string) => {
    localStorage.setItem('token', token);
}

export const clearSession = () => {
    localStorage.removeItem('token');
}

