import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'
import { loginApi } from '../services/auth.service'
import type { LoginCredentials } from '../types/auth.types'

export function LoginPage() {

    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (credentials: LoginCredentials) => {
        try {
            setIsLoading(true)
            setErrorMessage(null)
            const data = await loginApi(credentials)

            // // Guardamos el token real recibido de FastAPI
            localStorage.setItem('token', data.access_token)
            localStorage.setItem('user', JSON.stringify({ id: data.userId, name: data.userName }))

            // Redirigimos al dashboard
            navigate('/dashboard')
        } catch (error: any) {
            if (error.response?.status === 401) {
                setErrorMessage('Usuario o contraseña incorrectos.')
            } else {
                setErrorMessage('Error de conexión con el servidor. Intenta nuevamente.')
            }
        }
        finally {
            setIsLoading(false)
        }
    }

    const handleForgotPassword = () => {
        alert('Redirigiendo a recuperación de contraseña...')
    }

    return (
        <main className="min-h-screen! w-full! flex! items-center! justify-center! p-4! bg-slate-50 dark:bg-slate-950">
            <LoginForm
                onLoginSubmit={handleLogin}
                onForgotPasswordClick={handleForgotPassword}
                errorMessage={errorMessage}
                isLoading={isLoading}
            />
        </main>
    )
}