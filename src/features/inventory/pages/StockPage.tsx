import { useState, useEffect, useCallback, useRef } from 'react'
import { Navbar } from '../../../components/common/Navbar'
import { Input } from '../../../components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../../components/ui/table'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '../../../components/ui/dialog'

import { Button } from '../../../components/ui/button'
import { Search, ChevronLeft, ChevronRight, Package, Loader2, X, Eye, Warehouse } from 'lucide-react'
import { fetchStockProducts } from '../services/inventory.service'
import { Skeleton } from '../../../components/ui/skeleton'
// import { MOCK_PRODUCTS } from '../data/mockProducts'
import type { Product } from '../types/inventory.types'

const ITEMS_PER_PAGE = 5

export function StockPage() {
    // const [searchTerm, setSearchTerm] = useState('')
    const [inputValue, setInputValue] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    // const [activeSearchTerm, setActiveSearchTerm] = useState('')
    // const [filteredProducts, setFilteredProducts] = useState<Product[]>(MOCK_PRODUCTS)
    const [appliedSearchTerm, setAppliedSearchTerm] = useState<string>('')
    const [products, setProducts] = useState<Product[]>([])
    // Estado para controlar qué producto se inspecciona en el Modal
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [modalType, setModalType] = useState<'stock' | 'price' | null>(null)

    // Ref para el contenedor con overflow-x-auto de la tabla
    const tableContainerRef = useRef<HTMLDivElement>(null)

    const [totalRecords, setTotalRecords] = useState(0)


    // Función principal para llamar al backend
    const loadStockData = useCallback(async (term: string, page: number) => {
        setIsLoading(true)
        try {
            const response = await fetchStockProducts(term, page, ITEMS_PER_PAGE)
            setProducts(response.products)
            setTotalRecords(response.total)
            setAppliedSearchTerm(term)
        } catch (error) {
            console.error('Error al consultar stock:', error)
            alert('Error de conexión con el servidor. No se pudo obtener el inventario.')
            // NOTA: No actualizamos 'appliedSearchTerm' si ocurre un error
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Función explícita para resetear el scroll
    const resetTableScroll = () => {
        const container = tableContainerRef.current;

        if (!container) return;

        // Reiniciar el contenedor externo
        container.scrollLeft = 0;

        // Reiniciar los contenedores internos que pueden tener scroll
        container.querySelectorAll<HTMLElement>('*').forEach((element) => {
            if (element.scrollWidth > element.clientWidth) {
                element.scrollLeft = 0;
            }
        });
    };


    // Estado 0: Carga inicial de datos al montar el componente
    useEffect(() => {
        loadStockData('', 1)
    }, [loadStockData])

    // Cada vez que terminen de cargar nuevos productos, reseteamos el scroll al extremo izquierdo
    useEffect(() => {
        if (isLoading) return;

        resetTableScroll();
    }, [products, isLoading])

    // useEffect(() => {
    //     const container = tableContainerRef.current;

    //     if (!container) return;

    //     const inspectScroll = () => {
    //         console.log('Contenedor externo:', {
    //             scrollLeft: container.scrollLeft,
    //             scrollWidth: container.scrollWidth,
    //             clientWidth: container.clientWidth,
    //         });

    //         const inner = container.querySelector('div');

    //         if (inner) {
    //             console.log('Contenedor interno:', {
    //                 scrollLeft: inner.scrollLeft,
    //                 scrollWidth: inner.scrollWidth,
    //                 clientWidth: inner.clientWidth,
    //             });
    //         }
    //     };

    //     inspectScroll();
    // }, [products, isLoading]);


    // Ejecución explícita de la búsqueda
    const handleExecuteSearch = (termToSearch: string) => {
        const trimmed = termToSearch.trim()

        // RECHAZO: Si el término es idéntico al estado aplicado y estamos en pág 1, ignorar
        if (trimmed === appliedSearchTerm && currentPage === 1) {
            return
        }

        // VALIDACIÓN: Mínimo 3 caracteres (salvo al limpiar)
        if (trimmed.length > 0 && trimmed.length < 3) {
            alert('Por favor ingresa al menos 3 caracteres para realizar la búsqueda.')
            return
        }

        resetTableScroll()
        setCurrentPage(1)
        loadStockData(trimmed, 1)
    }

    // Cambio de página
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
        loadStockData(appliedSearchTerm, newPage)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleExecuteSearch(inputValue)
    }

    // Funciones auxiliares para abrir/cerrar
    const handleOpenModal = (product: Product, type: 'stock' | 'price') => {
        setSelectedProduct(product)
        setModalType(type)
    }

    const handleCloseModal = () => {
        setSelectedProduct(null)
        setModalType(null)
    }

    const startItem = totalRecords === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalRecords)
    const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE) || 1

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            {/* Navbar reutilizable con botón de retorno */}
            <Navbar showBackButton />

            <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
                {/* Título de la vista */}
                <div className="flex items-center gap-3">
                    <div className="p-2! rounded-xl! bg-emerald-500/10! text-emerald-600! dark:text-emerald-400!">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl! font-bold! md:text-3xl! tracking-tight!">Inventario de Productos</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2 max-w-lg items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Buscar por ISBN, Titulo o Autor (mín. 3 caracteres)..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isLoading}
                            className="pl-9 bg-background shadow-sm"
                        />
                        {inputValue && !isLoading && (
                            <button
                                type="button"
                                onClick={() => {
                                    setInputValue('')
                                    handleExecuteSearch('') // Si ya estaba en Estado 0 (aplicado ''), handleExecuteSearch lo rechazará automáticamente
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-full hover:bg-muted"
                                title="Borrar texto"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <Button type="submit" disabled={isLoading} className="font-medium min-w-[100px]">
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                <span>Buscando</span>
                            </>
                        ) : (
                            <span>Buscar</span>
                        )}
                    </Button>
                </form>

                {/* Tabla de Productos */}
                <div
                    ref={tableContainerRef}
                    className="border rounded-xl bg-card shadow-sm overflow-x-auto"
                >
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[100px] font-semibold text-center">CÓD</TableHead>
                                <TableHead className="font-semibold text-center">ISBN</TableHead>
                                <TableHead className="font-semibold md:text-center">TÍTULO</TableHead>
                                <TableHead className="font-semibold md:text-center">AUTOR</TableHead>
                                <TableHead className="font-semibold md:text-center">EDITORIAL</TableHead>
                                <TableHead className="text-center font-semibold">STOCK</TableHead>
                                <TableHead className="text-center font-semibold">PRECIOS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                // Filas de Skeleton mientras simula la consulta
                                Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-10 mx-auto rounded-full" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24 mx-auto rounded-md" /></TableCell>
                                    </TableRow>
                                ))
                            ) : products.length > 0 ? (
                                products.map((product) => {
                                    const enabledValues = Object.values(product.warehousesEnabled)
                                    const isTotallyDisabled = enabledValues.length > 0 && enabledValues.every((status) => status === false)
                                    return (
                                        <TableRow key={product.cod} className={`hover:bg-muted/30 transition-colors ${isTotallyDisabled ? 'opacity-50 bg-muted/20' : ''}`}>
                                            <TableCell className={`font-mono text-xs font-medium text-muted-foreground ${isTotallyDisabled ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                                                {product.cod}
                                            </TableCell>
                                            <TableCell className={`font-mono text-xs ${isTotallyDisabled ? 'line-through' : ''}`}>{product.isbn}</TableCell>
                                            <TableCell className={`font-medium text-foreground text-left ${isTotallyDisabled ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{product.title}</TableCell>
                                            <TableCell className={`text-muted-foreground text-left ${isTotallyDisabled ? 'line-through' : ''}`}>{product.author}</TableCell>
                                            <TableCell className={`text-muted-foreground text-left ${isTotallyDisabled ? 'line-through' : ''}`}>{product.publisher}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex! items-center! justify-center! gap-1.5!">
                                                    <span
                                                        className={`inline-flex! items-center! px-2.5! py-0.5! rounded-full! text-xs! font-semibold! ${product.stock > 10
                                                            ? 'bg-emerald-100! text-emerald-800! dark:bg-emerald-950/50! dark:text-emerald-400!'
                                                            : product.stock > 0
                                                                ? 'bg-amber-100! text-amber-800! dark:bg-amber-950/50! dark:text-amber-400!'
                                                                : 'bg-red-100! text-red-800! dark:bg-red-950/50! dark:text-red-400!'
                                                            }`}
                                                    >
                                                        {product.stock}
                                                    </span>

                                                    {/* Botón de inspección minimalista */}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleOpenModal(product, 'stock')}
                                                        className="h-6 w-6 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                                                        title="Ver stock por almacén"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                <Button
                                                    variant="outline"
                                                    size="xs"
                                                    onClick={() => handleOpenModal(product, 'price')}
                                                    className="h-7! px-2.5! text-xs! font-medium! text-slate-700! dark:text-slate-300! hover:text-primary! hover:bg-primary/10! transition-colors! "
                                                >
                                                    Ver precios
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                        {appliedSearchTerm
                                            ? `No se encontraron productos para "${appliedSearchTerm}".`
                                            : 'No hay productos disponibles.'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div >

                {/* Paginación */}
                < div className="flex items-center justify-between pt-2" >
                    <p className="text-xs text-muted-foreground">
                        {totalRecords > 0 ? (
                            <>
                                Mostrando <span className="font-semibold text-foreground">{startItem}-{endItem}</span> de{' '}
                                <span className="font-semibold text-foreground">{totalRecords}</span> productos
                            </>
                        ) : (
                            '0 productos encontrados'
                        )}
                    </p>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || isLoading}
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Anterior
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages || isLoading}
                        >
                            Siguiente
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div >
            </main >

            {/* Modal / Dialog de Desglose de Stock por Almacén */}
            <Dialog open={!!selectedProduct && !!modalType} onOpenChange={handleCloseModal}>
                <DialogContent className="sm:max-w-md!">
                    <DialogHeader>
                        <DialogTitle className="flex! items-center! gap-2! text-base! font-bold!">
                            <Warehouse className="w-5! h-5! text-emerald-600!" />
                            {modalType === 'stock' ? 'Desglose de Stock por Almacén' : 'Precios de Venta (PVP) por Almacén'}
                        </DialogTitle>
                        <DialogDescription className="text-xs!">
                            <span className="font-medium! text-foreground!">{selectedProduct?.title}</span> ({selectedProduct?.cod})
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-2! space-y-3!">
                        <div className="border! rounded-lg! divide-y! bg-card! text-sm!">
                            {/* VISTA DE STOCK */}
                            {selectedProduct && modalType === 'stock' && (
                                Object.keys(selectedProduct.warehousesStock).length > 0 ? (
                                    Object.entries(selectedProduct.warehousesStock).map(([wareCode, stockQty]) => {
                                        const isEnabled = selectedProduct.warehousesEnabled[wareCode] ?? true

                                        return (
                                            <div
                                                key={wareCode}
                                                className={`flex! items-center! justify-between! p-3! ${!isEnabled ? 'bg-muted/30 opacity-60' : ''
                                                    }`}
                                            >
                                                <div className="flex! items-center! gap-2!">
                                                    <span
                                                        className={`w-2! h-2! rounded-full! ${isEnabled ? 'bg-emerald-500' : 'bg-slate-400'
                                                            }`}
                                                    />
                                                    <span
                                                        className={`font-mono text-xs font-bold ${!isEnabled ? 'line-through text-muted-foreground' : 'text-foreground'
                                                            }`}
                                                    >
                                                        {wareCode}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="text-muted-foreground">Disponible:</span>
                                                    <span
                                                        className={`font-bold ${!isEnabled
                                                            ? 'line-through text-muted-foreground'
                                                            : 'text-emerald-600 dark:text-emerald-400'
                                                            }`}
                                                    >
                                                        {stockQty} unids.
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="p-4 text-center text-xs text-muted-foreground">
                                        No hay almacenes asignados a este producto.
                                    </div>
                                )
                            )}

                            {/* VISTA DE PRECIOS */}
                            {selectedProduct && modalType === 'price' && (
                                Object.keys(selectedProduct.warehousesPvp).length > 0 ? (
                                    Object.entries(selectedProduct.warehousesPvp).map(([wareCode, pvpPrice]) => {
                                        const isEnabled = selectedProduct.warehousesEnabled[wareCode] ?? true

                                        return (
                                            <div
                                                key={wareCode}
                                                className={`flex items-center justify-between p-3 ${!isEnabled ? 'bg-muted/30 opacity-60' : ''
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-blue-500' : 'bg-slate-400'
                                                            }`}
                                                    />
                                                    <span
                                                        className={`font-mono text-xs font-bold ${!isEnabled ? 'line-through text-muted-foreground' : 'text-foreground'
                                                            }`}
                                                    >
                                                        {wareCode}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="text-muted-foreground">PVP:</span>
                                                    <span
                                                        className={`font-bold ${!isEnabled ? 'line-through text-muted-foreground' : 'text-foreground'
                                                            }`}
                                                    >
                                                        S/ {pvpPrice.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="p-4 text-center text-xs text-muted-foreground">
                                        No hay precios configurados para este producto.
                                    </div>
                                )
                            )}
                        </div>

                        {/* Resumen al pie del modal */}
                        {modalType === 'stock' && (
                            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                                <span className="font-semibold text-emerald-900 dark:text-emerald-200">Stock Total Consolidado:</span>
                                <span className="font-bold text-sm text-emerald-700 dark:text-emerald-400">
                                    {selectedProduct?.stock} unidades
                                </span>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    )
}