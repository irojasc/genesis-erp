import {
    Package,
    Users,
    ShoppingCart,
    FileText,
    Settings,
    type LucideIcon
} from 'lucide-react'

export interface ErpModule {
    id: string;
    title: string;
    icon: LucideIcon;
    path: string;
    color: string; // Color distintivo para el contenedor del ícono estilo Odoo
    enabled: boolean;
}

export const ERP_MODULES: ErpModule[] = [
    {
        id: 'inventory',
        title: 'Inventario',
        icon: Package,
        path: '/inventory',
        color: 'bg-emerald-500 text-white shadow-emerald-500/20',
        enabled: true,
    },
    {
        id: 'contacts',
        title: 'Contactos',
        icon: Users,
        path: '/contacts',
        color: 'bg-blue-500 text-white shadow-blue-500/20',
        enabled: true,
    },
    {
        id: 'sales',
        title: 'Ventas',
        icon: ShoppingCart,
        path: '/sales',
        color: 'bg-amber-500 text-white shadow-amber-500/20',
        enabled: false,
    },
    {
        id: 'reports',
        title: 'Reportes',
        icon: FileText,
        path: '/reports',
        color: 'bg-purple-500 text-white shadow-purple-500/20',
        enabled: false,
    },
    {
        id: 'settings',
        title: 'Ajustes',
        icon: Settings,
        path: '/settings',
        color: 'bg-slate-600 text-white shadow-slate-600/20',
        enabled: false,
    },
]