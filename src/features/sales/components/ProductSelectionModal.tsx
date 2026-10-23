// import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react'
import { type QuickSaleProduct } from '../services/quick-sale.service'

interface ProductSelectionModalProps {
    open: boolean
    onClose: () => void
    products: QuickSaleProduct[]
    totalRecords: number
    currentPage: number
    onPageChange: (newPage: number) => void
    onSelectProduct: (product: QuickSaleProduct) => void
    isLoading?: boolean
}


export function ProductSelectionModal({
    open,
    onClose,
    products,
    totalRecords,
    currentPage,
    onPageChange,
    onSelectProduct,
    isLoading = false,
}: ProductSelectionModalProps) {
    const totalPages = Math.ceil(totalRecords / 5) || 1

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md w-[95vw] rounded-xl p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold">
                        Coincidencias Encontradas ({totalRecords})
                    </DialogTitle>
                </DialogHeader>

                {/* Lista de Tarjetas */}
                <div className="space-y-2 py-2 max-h-[60vh] overflow-y-auto">
                    {products.map((p) => (
                        <div
                            key={p.cod}
                            onClick={() => {
                                onSelectProduct(p)
                                onClose()
                            }}
                            className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer space-y-1.5 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <h4 className="text-xs font-bold text-foreground line-clamp-2 leading-snug">
                                    {p.title}
                                </h4>
                                <span className="font-mono text-xs font-bold text-emerald-600 shrink-0">
                                    S/ {p.pvp.toFixed(2)}
                                </span>
                            </div>

                            {/* Fila Autor / Editorial con overflow-hidden */}
                            <p className="text-[11px] text-muted-foreground truncate">
                                {p.autor} • <span className="italic">{p.publisher}</span>
                            </p>

                            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-dashed">
                                <span className="font-mono font-medium">
                                    CÓD: {p.cod} | Stock: {p.stock}
                                </span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 px-2 text-[11px] text-emerald-600 font-bold hover:bg-emerald-50"
                                >
                                    <PlusCircle className="w-3.5 h-3.5 mr-1" />
                                    Agregar
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-2 border-t text-xs">
                        <span className="text-muted-foreground">
                            Pág. {currentPage} de {totalPages}
                        </span>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2"
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1 || isLoading}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2"
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages || isLoading}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}


// interface ProductSearchResult {
//     cod: string;        // GN_1 (Identificador único)
//     isbn: string;
//     title: string;
//     author: string;
//     publisher: string;
//     price: number;      // PVP del almacén seleccionado
//     stock: number;      // Stock en el almacén seleccionado
// }

// interface ProductSelectionModalProps {
//     open: boolean;
//     onClose: () => void;
//     products: ProductSearchResult[];
//     onSelectProduct: (product: ProductSearchResult) => void;
//     itemsPerPage?: number;
// }

// export function ProductSelectionModal({
//     open,
//     onClose,
//     products,
//     onSelectProduct,
//     itemsPerPage = 4,
// }: ProductSelectionModalProps) {
//     const [currentPage, setCurrentPage] = useState(1)

//     const totalPages = Math.ceil(products.length / itemsPerPage) || 1
//     const startIndex = (currentPage - 1) * itemsPerPage
//     const currentProducts = products.slice(startIndex, startIndex + itemsPerPage)

//     const handleSelect = (prod: ProductSearchResult) => {
//         onSelectProduct(prod)
//         onClose()
//     }

//     return (
//         <Dialog open={open} onOpenChange={onClose}>
//             <DialogContent className="max-w-md w-[95vw] rounded-xl p-4 sm:p-6">
//                 <DialogHeader>
//                     <DialogTitle className="text-base font-bold">
//                         Coincidencias Encontradas ({products.length})
//                     </DialogTitle>
//                 </DialogHeader>

//                 {/* Lista de Tarjetas Resumidas para Mobile */}
//                 <div className="space-y-2 py-2 max-h-[60vh] overflow-y-auto">
//                     {currentProducts.map((p) => (
//                         <div
//                             key={p.cod}
//                             onClick={() => handleSelect(p)}
//                             className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer space-y-1.5 shadow-sm"
//                         >
//                             <div className="flex items-start justify-between gap-2">
//                                 <h4 className="text-xs font-bold text-foreground line-clamp-2 leading-snug">
//                                     {p.title}
//                                 </h4>
//                                 <span className="font-mono text-xs font-bold text-emerald-600 shrink-0">
//                                     S/ {p.price.toFixed(2)}
//                                 </span>
//                             </div>

//                             {/* Fila Autor / Editorial con overflow hidden */}
//                             <p className="text-[11px] text-muted-foreground truncate">
//                                 {p.author} • <span className="italic">{p.publisher}</span>
//                             </p>

//                             <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-dashed">
//                                 <span className="font-mono font-medium">CÓD: {p.cod} | ISBN: {p.isbn}</span>
//                                 <Button
//                                     size="sm"
//                                     variant="ghost"
//                                     className="h-6 px-2 text-[11px] text-emerald-600 font-bold hover:bg-emerald-50"
//                                 >
//                                     <PlusCircle className="w-3.5 h-3.5 mr-1" />
//                                     Agregar
//                                 </Button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Paginación del Modal */}
//                 {totalPages > 1 && (
//                     <div className="flex items-center justify-between pt-2 border-t text-xs">
//                         <span className="text-muted-foreground">
//                             Pág. {currentPage} de {totalPages}
//                         </span>
//                         <div className="flex items-center gap-1">
//                             <Button
//                                 variant="outline"
//                                 size="sm"
//                                 className="h-7 px-2"
//                                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                                 disabled={currentPage === 1}
//                             >
//                                 <ChevronLeft className="w-4 h-4" />
//                             </Button>
//                             <Button
//                                 variant="outline"
//                                 size="sm"
//                                 className="h-7 px-2"
//                                 onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                                 disabled={currentPage >= totalPages}
//                             >
//                                 <ChevronRight className="w-4 h-4" />
//                             </Button>
//                         </div>
//                     </div>
//                 )}
//             </DialogContent>
//         </Dialog>
//     )
// }