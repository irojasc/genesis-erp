// src/features/sales/services/warehouse.service.ts
import { api } from '../../../lib/axios'

export interface WarehouseOption {
    id: number
    code: string
    name: string
}

// Diccionario de nombres legibles (Hardcoded por ahora)
const WAREHOUSE_NAMES: Record<string, string> = {
    STC: 'STA. CATALINA',
    SNTG: 'SANTIAGO',
    ALYZ: 'ALAYZA',
    WEB: 'WEB',
    FRA: 'FERIA',
    BIBL: 'BIBLIOTECA',
}

export const fetchActivePhysicalWarehouses = async (): Promise<WarehouseOption[]> => {
    const response = await api.get('/warehouse/')
    const rawList = response.data.result || []

    return rawList
        // 1. Filtrar: isVirtual == false Y enabled == true
        .filter((w: any) => w.auth?.isVirtual === false && w.auth?.enabled === true)
        // 2. Mapear al formato interno con Fallback
        .map((w: any) => {
            const code = w.cod || ''
            const name = WAREHOUSE_NAMES[code] || code // Fallback al mismo código si no existe en el diccionario

            return {
                id: w.id,
                code,
                name,
            }
        })
}