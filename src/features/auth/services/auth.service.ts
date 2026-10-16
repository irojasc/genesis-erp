import { api } from '../../../lib/axios'
import type { LoginCredentials } from '../types/auth.types'

export interface LoginResponse {
    userId: number;
    userName: string;
    hashed: string;
    access_token: string;
    token_type: string;
}

export const loginApi = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Construimos la data en formato application/x-www-form-urlencoded exigido por OAuth2PasswordRequestForm
    const formData = new URLSearchParams()
    formData.append('username', credentials.usernameOrEmail)
    formData.append('password', credentials.password)

    const response = await api.post<LoginResponse>('/Login/token', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })

    return response.data
}