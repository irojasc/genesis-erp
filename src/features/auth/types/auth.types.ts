export interface LoginCredentials {
    usernameOrEmail: string;
    password: string;
}

export interface UserSession {
    id: string;
    name: string;
    email: string;
    role: string;
    token: string;
}