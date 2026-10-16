import { useNavigate } from 'react-router-dom'
import { ERP_MODULES, type ErpModule } from '../../../config/modules.config'
import { Navbar } from '../../../components/common/Navbar'

export function DashboardPage() {
    const navigate = useNavigate()

    // Recuperamos datos del usuario del localStorage
    // const user = JSON.parse(localStorage.getItem('user') || '{"name": "Usuario"}')

    // const handleLogout = () => {
    //     localStorage.removeItem('token')
    //     localStorage.removeItem('user')
    //     navigate('/login')
    // }

    const handleModuleClick = (module: ErpModule) => {
        if (module.enabled) {
            navigate(module.path)
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col relative bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
            <Navbar showBackButton />
            {/* Contenido Principal: Grid Estilo Odoo */}
            <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-10 flex items-start justify-center">

                {/* Grid de 4 columnas en Celular y 6 en Pantallas Medianas/PC */}
                <div className="grid grid-cols-4 md:grid-cols-6 gap-x-4 gap-y-6 md:gap-x-8 md:gap-y-8 justify-items-center w-full max-w-3xl">
                    {ERP_MODULES.map((module) => {
                        const IconComponent = module.icon

                        return (
                            <div
                                key={module.id}
                                onClick={() => handleModuleClick(module)}
                                className={`flex flex-col items-center group cursor-pointer select-none transition-all duration-150 ${!module.enabled ? 'opacity-40 grayscale pointer-events-none' : ''
                                    }`}
                            >
                                {/* Tarjeta Cuadrada Compacta (Mínimo 60x60, padding de 10) */}
                                <div
                                    className={`w-16 h-16 sm:w-20 sm:h-20 p-2.5 rounded-2xl flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105 active:scale-95 ${module.color}`}
                                >
                                    <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.8]" />
                                </div>

                                {/* Nombre del Módulo Debajo de la Tarjeta */}
                                <span className="mt-2 text-[11px] sm:text-xs font-medium text-center text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors line-clamp-1 max-w-[70px] sm:max-w-[84px]">
                                    {module.title}
                                </span>
                            </div>
                        )
                    })}
                </div>

            </main>

            {/* Footer sencillo */}
            <footer className="py-4 text-center text-xs text-muted-foreground border-t">
                Génesis ERP &copy; {new Date().getFullYear()} — Cusco, Perú
            </footer>
        </div>
    )
}

// import { useNavigate } from 'react-router-dom'
// import { Button } from '../../../components/ui/button'

// export function DashboardPage() {
//     const navigate = useNavigate()

//     const handleLogout = () => {
//         localStorage.removeItem('token')
//         navigate('/login')
//     }

//     return (
//         <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8 flex flex-col items-center justify-center space-y-4">
//             <h1 className="text-3xl font-bold">¡Bienvenido al Panel Principal de Génesis ERP!</h1>
//             <p className="text-muted-foreground">Estás en una ruta protegida.</p>
//             <Button variant="destructive" onClick={handleLogout}>
//                 Cerrar Sesión
//             </Button>
//         </div>
//     )
// }