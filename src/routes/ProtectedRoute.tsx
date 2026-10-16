import { Navigate, Outlet } from 'react-router-dom'

interface ProtectedRouteProps {
    redirectTo?: string;
}

export function ProtectedRoute({ redirectTo = '/login' }: ProtectedRouteProps) {
    // Verificación temporal de token en localStorage
    const isAuthenticated = Boolean(localStorage.getItem('token'))

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />
    }

    // Renderiza las rutas hijas si el usuario está autenticado
    return <Outlet />
}