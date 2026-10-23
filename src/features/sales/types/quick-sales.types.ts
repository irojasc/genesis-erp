export interface CustomerData {
    wantsReceipt: boolean; // Checkbox "Desea recibo?"
    docType: 'DNI' | 'PAS' | 'C.E.' | 'RUC' | '';
    docNumber: string;
    name: string;
    phone?: string;
    email?: string;
}

// export interface SaleItem {
//     productCod: string; // GN_1 (Identificador Único para hacer match)
//     isbn: string;
//     title: string;
//     author: string;
//     publisher: string;
//     unitPrice: number; // Modificable (nunca <= 0)
//     quantity: number;
//     subtotal: number; // unitPrice * quantity
// }

export interface SaleItem {
    productCod: string; // Mantenemos internamente en React para hacer match (ej: "GN_50")
    id: number;         // 👈 ID numérico del producto (ej: 50)
    cod: string;        // 👈 Prefijo del producto (ej: "GN")
    isbn: string;
    title: string;
    author?: string;    // 👈 Reincorporado como opcional
    publisher?: string; // 👈 Reincorporado como opcional
    unitPrice: number;  // Precio unitario
    quantity: number;   // Cantidad
    subtotal: number;   // unitPrice * quantity
}

export interface QuickSalePayload {
    warehouseCode: string; // Almacén seleccionado
    observations: string | null;
    customer: CustomerData | null;
    paymentMethod: string | null; // Lo veremos en la confirmación
    items: SaleItem[];
    totalTitles: number; // Cantidad de títulos distintos
    totalItems: number;  // Suma total de unidades
    totalAmount: number; // Suma total en dinero
}