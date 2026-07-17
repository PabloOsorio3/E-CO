export interface SignupInterface {
    email: string;
    type_user_id: number;
    password: string;
    confirm_password: string;
}

export interface SignupResponseInterface {
    status: number;
    message: string;
}