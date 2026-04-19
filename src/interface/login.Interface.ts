export interface LoginInterface {
    email: string;
    password: string;
}

export interface LoginResponseInterface {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
}   