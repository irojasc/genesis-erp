import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { ProtectedRoute } from './ProtectedRoute'
import { StockPage } from '../features/inventory/pages/StockPage'
import { QuickSalePage } from '../features/sales/pages/QuickSalePage'

export function AppRoutes() {
    return (
        <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rutas protegidas (Requieren Login) */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                {/* Aquí agregaremos más rutas del ERP en el futuro (ej. /inventario, /ventas) */}
                <Route path="/inventory" element={<Navigate to="/inventory/stock" replace />} />
                <Route path="/inventory/stock" element={<StockPage />} />

                {/* 2. Ventas (NUEVAS LÍNEAS) */}
                <Route path="/sales" element={<Navigate to="/sales/quick-sale" replace />} />
                <Route path="/sales/quick-sale" element={<QuickSalePage />} />

                <Route
                    path="/contacts"
                    element={
                        <div className="p-8">
                            <h1 className="text-2xl font-bold">Módulo de Contactos</h1>
                            <p className="text-muted-foreground mt-2">Próximamente directorio de clientes y proveedores.</p>
                        </div>
                    }
                />
            </Route>

            {/* Redirección por defecto: si va a raíz "/", redirige a /dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Ruta 404: redirige al inicio */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}