import { api } from '../../../lib/axios'
import type { Product } from '../types/inventory.types'

export interface StockFetchResponse {
    products: Product[];
    page: number;
    limit: number;
    total: number;
}

export const fetchStockProducts = async (
    searchTerm: string = '',
    page: number = 1,
    limit: number = 5,
): Promise<StockFetchResponse> => {
    const response = await api.get('/inventory/stock_by_product_attribute', {
        params: {
            query_search: searchTerm.trim() || undefined,
            page,
            limit,
        },
    })

    const items = response.data.result || []

    const mappedProducts: Product[] = items.map((item: any) => {
        // Calculamos el stock total sumando los almacenes disponibles (Cusco + Lima, etc.)
        const totalStock = Object.values(item.stock as Record<string, number>).reduce(
            (acc, curr) => acc + curr,
            0
        )

        // Obtenemos el precio del primer almacén disponible
        const firstPrice = Object.values(item.pvp as Record<string, number>)[0] || 0.0

        return {
            cod: item.cod,           // Código concatenado (ej. GN_1)
            isbn: item.isbn,
            title: item.title,
            author: item.autor,      // Del atributo 'autor' del backend
            publisher: item.publisher,
            price: firstPrice,
            stock: totalStock,
            warehousesStock: item.stock || {},
            warehousesPvp: item.pvp || {},
            warehousesEnabled: item.isEnabled || {},
        }
    })

    return {
        products: mappedProducts,
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total || 0,
    }
}