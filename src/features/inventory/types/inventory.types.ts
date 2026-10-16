export interface Product {
    cod: string;
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    price: number; // Precio
    stock: number; // Suma total de stock en todos los almacenes
    warehousesStock: Record<string, number>; // 👈 Desglose por almacén (ej: {"ALM-CUSCO": 10, "ALM-LIMA": 5})
    warehousesPvp?: Record<string, number>;
    warehousesEnabled: Record<string, boolean>;
}