import axios from 'axios'

// Cambia esta URL por la dirección real de tu backend (ej. http://localhost:8000 o servidor en nube)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

// Interceptor para adjuntar automáticamente el Bearer Token en peticiones protegidas
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})


api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url || '';

        // Definimos las URLs relativas a la autenticación (ajusta según tu endpoint backend)
        const isLoginRequest = requestUrl.includes('/login') || requestUrl.includes('/auth');

        // Solo limpiamos sesión y redirigimos si NO es la petición de inicio de sesión
        if (status === 401 && !isLoginRequest) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')

            // Tip: Si usas React Router, es mejor evitar window.location.href para no recargar,
            // pero si usas HashRouter puedes usar navigate o window.location.hash de forma segura:
            window.location.hash = '/login';
        }

        return Promise.reject(error)
    }
)