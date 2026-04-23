import { jwtDecode } from "jwt-decode";

export const getCurrentToken = () => {
    return localStorage.getItem('token');
}

export const getCurrentUser = () => {
    const token = getCurrentToken();
    if (token) {
        return jwtDecode(token);
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

