import { api } from '../../../lib/axios'

export interface QuickSaleProduct {
    id: number
    cod: string       // GN_1 (Código único)
    isbn: string
    title: string
    autor: string
    publisher: string
    pvp: number       // Precio unitario directo del almacén
    stock: number     // Cantidad disponible en el almacén
}

export interface QuickSaleSearchResponse {
    total: number
    result: QuickSaleProduct[]
}

export const searchProductsForQuickSale = async (
    searchTerm: string,
    warehouseCode: string,
    page: number = 1,
    limit: number = 5
): Promise<QuickSaleSearchResponse> => {
    const response = await api.get('/inventory/stock_by_product_attribute', {
        params: {
            query_search: searchTerm.trim(),
            ware_code: warehouseCode,
            page,
            limit,
        },
    })

    return {
        total: response.data.total || 0,
        result: response.data.result || [],
    }
}

export const registerQuickSale = async (payload: any) => {
    const response = await api.post('/sales/quick-sale', payload)
    return response.data
}