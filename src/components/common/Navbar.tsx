import { useNavigate, Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { LogOut, ArrowLeft } from 'lucide-react'
import logoImg from '../../assets/public/AuthLogo.png'

interface NavbarProps {
    showBackButton?: boolean
}

export function Navbar({ showBackButton = false }: NavbarProps) {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user') || '{"name": "Usuario"}')

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    return (
        <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-10 px-4 md:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {showBackButton && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/dashboard')}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Volver a Aplicaciones"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                )}
                <Link to="/dashboard" className="flex items-center gap-2.5">
                    {/* <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-base shadow-sm">
                        G
                    </div>
                    <span className="font-semibold text-base tracking-tight">Génesis ERP</span> */}
                    <img
                        src={logoImg}
                        alt="Génesis ERP Logo"
                        className="h-10 w-auto object-contain"
                    />
                </Link>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-xs md:text-sm text-muted-foreground hidden sm:inline-block">
                    Hola, <span className="font-medium text-foreground">{user.name}</span>
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-destructive hover:bg-destructive/10 text-xs"
                >
                    <LogOut className="w-3.5 h-3.5 mr-1.5" />
                    <span>Salir</span>
                </Button>
            </div>
        </header>
    )
}