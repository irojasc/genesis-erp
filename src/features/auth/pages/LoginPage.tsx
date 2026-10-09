import { LoginForm } from '../components/LoginForm'
import type { LoginCredentials } from '../types/auth.types'

export function LoginPage() {
    const handleLogin = (credentials: LoginCredentials) => {
        console.log('Credenciales ingresadas:', credentials)
        // Aquí integraremos el servicio de autenticación o backend
    }

    const handleForgotPassword = () => {
        alert('Redirigiendo a recuperación de contraseña...')
    }

    return (
        <main className="min-h-screen! w-full! flex! items-center! justify-center! p-4! bg-slate-50 dark:bg-slate-950">
            <LoginForm
                onLoginSubmit={handleLogin}
                onForgotPasswordClick={handleForgotPassword}
            />
        </main>
    )
}