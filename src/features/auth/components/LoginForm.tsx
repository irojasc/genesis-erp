import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from "lucide-react";
import type { LoginCredentials } from '../types/auth.types'
import logoImg from '../../../assets/public/AuthLogo.png'

interface LoginFormProps {
    onLoginSubmit?: (credentials: LoginCredentials) => void;
    onForgotPasswordClick?: () => void;
}

export function LoginForm({ onLoginSubmit, onForgotPasswordClick }: LoginFormProps) {
    const [credentials, setCredentials] = useState<LoginCredentials>({
        usernameOrEmail: '',
        password: '',
    })
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCredentials((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulación de envío / integración futura con API
        if (onLoginSubmit) {
            onLoginSubmit(credentials)
        }

        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Card className="w-full max-w-md shadow-lg border-border/40">
            <CardHeader className="space-y-3 text-center pb-6">
                {/* Logo superior */}
                <div className="flex justify-center items-center">
                    <img
                        src={logoImg}
                        alt="Génesis ERP Logo"
                        className="h-16 w-auto object-contain"
                    />
                </div>

                <div>
                    {/* <CardTitle className="text-2xl font-bold tracking-tight">
                        Génesis ERP
                    </CardTitle> */}

                    <CardDescription className="text-muted-foreground text-sm mt-1">
                        Ingresa tus credenciales para acceder al sistema
                    </CardDescription>
                </div>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4! pb-4!">
                    {/* Campo Usuario / Correo */}
                    <div className="space-y-2! text-left!">
                        <Label htmlFor="usernameOrEmail">Usuario</Label>
                        <Input
                            id="usernameOrEmail"
                            name="usernameOrEmail"
                            type="text"
                            placeholder="pcabello"
                            value={credentials.usernameOrEmail}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                        />
                    </div>

                    {/* Campo Contraseña */}
                    <div className="space-y-2 text-left">
                        <Label htmlFor="password">Contraseña</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent"
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex! flex-col! space-y-4! pt-6! pb-6!">
                    {/* Botón de Ingreso */}
                    <Button type="submit" className="w-full! font-medium!" disabled={isLoading}>
                        {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
                    </Button>

                    {/* Link para recuperar contraseña */}
                    <div className="text-center! text-sm!">
                        <button
                            type="button"
                            onClick={onForgotPasswordClick}
                            className="text-muted-foreground! hover:text-primary! transition-colors! underline-offset-4! hover:underline! text-xs!"
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}