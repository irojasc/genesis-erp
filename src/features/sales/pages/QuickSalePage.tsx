import { useState, useRef, useEffect } from 'react'
import { PaymentMethodModal } from '../components/PaymentMethodModal'
import { Navbar } from '../../../components/common/Navbar'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '../../../components/ui/dialog'
import { Search, X, MessageSquare, UserPlus, Zap } from 'lucide-react'
import { CustomerModal } from '../components/CustomerModal'
import type { CustomerData, QuickSalePayload, SaleItem } from '../types/quick-sales.types'
import { SaleItemCard } from '../components/SaleItemCard'
import { AlertCircle } from 'lucide-react'

import {
    registerQuickSale,
    searchProductsForQuickSale,
    type QuickSaleProduct,
} from '../services/quick-sale.service'
import { ProductSelectionModal } from '../components/ProductSelectionModal'

import {
    fetchActivePhysicalWarehouses,
    type WarehouseOption,
} from '../services/warehouse.service'


// Clave para guardar en el almacenamiento de la sesión
const SESSION_WAREHOUSE_KEY = 'genesis_pos_selected_warehouse'

export function QuickSalePage() {
    const [inputValue, setInputValue] = useState('')
    const [isLoadingSearch, setIsLoadingSearch] = useState(false)

    // 1. Crear la referencia al input de búsqueda
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Función de ayuda para restaurar el foco
    const focusSearchInput = () => {
        // Usamos setTimeout(..., 50) para esperar que el DOM termine de actualizarse o cerrar modales
        setTimeout(() => {
            searchInputRef.current?.focus()
        }, 50)
    }

    // Estado para el modal de método de pago
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
    // Disparar apertura del modal al presionar "Vender"
    const handleOpenPaymentModal = () => {
        if (salePayload.items.length === 0) return
        setIsPaymentModalOpen(true)
    }

    // Estados para Búsqueda y Modales
    const [searchResults, setSearchResults] = useState<QuickSaleProduct[]>([])
    const [totalSearchResults, setTotalSearchResults] = useState(0)
    const [modalSearchPage, setModalSearchPage] = useState(1)
    const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false)
    const [isNotFoundModalOpen, setIsNotFoundModalOpen] = useState(false)

    // const [isLoading, setIsLoading] = useState(false)
    const [warehouses, setWarehouses] = useState<WarehouseOption[]>([])
    const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(true)

    // 1. Obtener el almacén guardado en la sesión actual (o "" si es la primera vez)
    const getInitialWarehouse = (): string => {
        return sessionStorage.getItem(SESSION_WAREHOUSE_KEY) || ''
    }



    // Objeto Global del Payload de Venta
    const [salePayload, setSalePayload] = useState<QuickSalePayload>({
        // warehouseCode: getInitialWarehouse() || WAREHOUSES[0].code,
        warehouseCode: getInitialWarehouse() || '',
        observations: null,
        customer: null,
        paymentMethod: null,
        items: [],
        totalTitles: 0,
        totalItems: 0,
        totalAmount: 0,
    })


    // Carga y filtrado dinámico de almacenes al montar la vista
    useEffect(() => {
        const loadWarehouses = async () => {
            try {
                setIsLoadingWarehouses(true)
                const activeWarehouses = await fetchActivePhysicalWarehouses()
                setWarehouses(activeWarehouses)

                // Si el almacén guardado en sesión ya no es válido/físico, reseteamos la selección
                const isSavedValid = activeWarehouses.some(
                    (w) => w.code === salePayload.warehouseCode
                )
                if (!isSavedValid && salePayload.warehouseCode) {
                    sessionStorage.removeItem(SESSION_WAREHOUSE_KEY)
                    setSalePayload((prev) => ({ ...prev, warehouseCode: '' }))
                }
            } catch (error) {
                console.error('Error al cargar la lista de almacenes:', error)
            } finally {
                setIsLoadingWarehouses(false)
            }
        }

        loadWarehouses()
    }, [])

    // Booleano derivado: si no hay almacén, la app está bloqueada
    const isWarehouseSelected = Boolean(salePayload.warehouseCode)

    // Modales
    const [isObsModalOpen, setIsObsModalOpen] = useState(false)
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
    const [tempObs, setTempObs] = useState('')

    // Formatear texto dinámico del botón de cliente
    const getCustomerButtonLabel = () => {
        if (!salePayload.customer) return 'Agregar cliente'
        const c = salePayload.customer
        if (c.docNumber && c.name) return `${c.docNumber} - ${c.name}`
        if (c.name) return c.name
        if (c.email) return c.email
        if (c.phone) return c.phone
        return 'Cliente Registrado'
    }

    const handleSaveObservations = () => {
        setSalePayload((prev) => ({
            ...prev,
            observations: tempObs.trim() || null,
        }))
        setIsObsModalOpen(false)
    }

    const handleSaveCustomer = (customer: CustomerData) => {
        setSalePayload((prev) => ({
            ...prev,
            customer,
        }))
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputValue.trim()) return
        // La lógica de búsqueda y auto-agregado la conectaremos en el Paso 2
        // console.log('Buscando:', inputValue, 'en almacén:', salePayload.warehouseCode)
        handleExecuteSearch(inputValue, 1)
    }

    // 2. Manejador para el cambio de almacén
    const handleWarehouseChange = (newWarehouseCode: string) => {
        sessionStorage.setItem(SESSION_WAREHOUSE_KEY, newWarehouseCode)
        setSalePayload((prev) => ({
            ...prev,
            warehouseCode: newWarehouseCode,
            items: [],
            totalTitles: 0,
            totalItems: 0,
            totalAmount: 0,
        }))
    }

    // Disparar la Búsqueda
    const handleExecuteSearch = async (term: string, page: number = 1) => {
        const trimmed = term.trim()

        // 1. Regla de Mínimo 3 Caracteres
        if (trimmed.length < 3) {
            alert('Ingresa al menos 3 caracteres para buscar.')
            focusSearchInput() // 👈 Recupera foco si falla la validación
            return
        }

        setIsLoadingSearch(true)
        try {
            const response = await searchProductsForQuickSale(
                trimmed,
                salePayload.warehouseCode,
                page,
                5 // limit = 5 por página
            )

            const total = response.total
            const items = response.result

            if (total === 0) {
                // CASO 1: 0 resultados -> Modal de alerta
                setIsNotFoundModalOpen(true)
            } else if (total === 1 && page === 1) {
                // CASO 2: Exactamente 1 resultado -> Agregado directo al carrito
                addProductToCart(items[0])
                setInputValue('') // Autoclean del buscador
                focusSearchInput() // 👈 Recupera el foco inmediatamente para continuar escaneando
            } else {
                // CASO 3: Más de 1 resultado -> Abrir Modal Paginado
                setSearchResults(items)
                setTotalSearchResults(total)
                setModalSearchPage(page)
                setIsSelectionModalOpen(true)
            }
        } catch (error) {
            console.error('Error al realizar búsqueda:', error)
            alert('Error de conexión con el servidor al buscar el producto.')
        } finally {
            setIsLoadingSearch(false)
        }
    }

    const handleModalPageChange = (newPage: number) => {
        handleExecuteSearch(inputValue, newPage)
    }

    // Agregado al carrito (utiliza el 'cod' único como match)
    const addProductToCart = (product: QuickSaleProduct) => {
        setSalePayload((prev) => {
            const existingIndex = prev.items.findIndex(
                (item) => item.productCod === product.cod
            )

            let updatedItems = [...prev.items]

            if (existingIndex >= 0) {
                const currentItem = updatedItems[existingIndex]
                const newQty = currentItem.quantity + 1
                updatedItems[existingIndex] = {
                    ...currentItem,
                    quantity: newQty,
                    subtotal: Number((currentItem.unitPrice * newQty).toFixed(2)),
                }
            } else {
                // Separar "GN_50" -> cod: "GN", id: 50
                const parts = product.cod.split('_')
                const parsedCod = parts[0] || 'GN'
                const parsedId = parts[1] ? parseInt(parts[1], 10) : product.id

                updatedItems.push({
                    productCod: product.cod, // Para match de React
                    id: parsedId,
                    cod: parsedCod,
                    isbn: product.isbn,
                    title: product.title,
                    unitPrice: product.pvp,
                    quantity: 1,
                    subtotal: product.pvp,
                })
            }

            return recalculateTotals(prev, updatedItems)
        })
    }

    const handleUpdateQuantity = (productCod: string, delta: number) => {
        setSalePayload((prev) => {
            const updatedItems = prev.items.map((item) => {
                if (item.productCod === productCod) {
                    // 🟢 Mantenemos como mínimo 1 unidad (no permite bajar a 0)
                    const newQty = Math.max(1, item.quantity + delta)

                    return {
                        ...item,
                        quantity: newQty,
                        subtotal: Number((item.unitPrice * newQty).toFixed(2)),
                    }
                }
                return item
            })

            return recalculateTotals(prev, updatedItems)
        })
    }

    // Editar precio unitario (Validación: jamás menor o igual a 0)
    const handleUpdateUnitPrice = (productCod: string, newPrice: number) => {
        if (isNaN(newPrice) || newPrice <= 0) return

        setSalePayload((prev) => {
            const updatedItems = prev.items.map((item) => {
                if (item.productCod === productCod) {
                    return {
                        ...item,
                        unitPrice: newPrice,
                        subtotal: Number((newPrice * item.quantity).toFixed(2)),
                    }
                }
                return item
            })

            return recalculateTotals(prev, updatedItems)
        })
    }

    // 3. Modificar el cierre/selección del modal de productos
    const handleSelectProductFromModal = (product: QuickSaleProduct) => {
        addProductToCart(product)
        setInputValue('')
        setIsSelectionModalOpen(false)
        focusSearchInput() // 👈 Recupera el foco tras seleccionar una opción del modal
    }

    const handleCloseSelectionModal = () => {
        setIsSelectionModalOpen(false)
        focusSearchInput() // 👈 Recupera el foco si cierra el modal sin elegir
    }

    const handleCloseNotFoundModal = () => {
        setIsNotFoundModalOpen(false)
        focusSearchInput() // 👈 Recupera el foco al cerrar la alerta de sin resultados
    }

    // Eliminar ítem del carrito
    const handleRemoveItem = (productCod: string) => {
        setSalePayload((prev) => {
            const updatedItems = prev.items.filter((item) => item.productCod !== productCod)
            return recalculateTotals(prev, updatedItems)
        })
    }

    const handleConfirmSale = async (paymentMethodCode: string) => {
        console.log(salePayload)
        const cleanedItems = salePayload.items.map(({ productCod, ...rest }) => rest)

        const finalPayload = {
            warehouseCode: salePayload.warehouseCode,
            observations: salePayload.observations,
            customer: salePayload.customer,
            paymentMethod: paymentMethodCode,
            items: cleanedItems,
            totalTitles: salePayload.totalTitles,
            totalItems: salePayload.totalItems,
            totalAmount: salePayload.totalAmount,
        }

        try {
            setIsLoadingSearch(true)
            const res = await registerQuickSale(finalPayload)
            alert(`¡Venta #${res.sale_id} registrada con éxito!`)

            // Reiniciamos el documento preservando el almacén
            resetSaleDocument()
            setIsPaymentModalOpen(false)
        } catch (error) {
            console.error('Error al registrar la venta:', error)
            alert('Ocurrió un fallo al intentar registrar la venta.')
        } finally {
            setIsLoadingSearch(false)
        }
    }

    const resetSaleDocument = () => {
        // 1. Limpia el buscador
        setInputValue('')

        // 2. Resetea el payload conservando únicamente el almacén activo
        setSalePayload((prev) => ({
            warehouseCode: prev.warehouseCode, // 👈 Se mantiene el almacén
            observations: null,
            customer: null,
            paymentMethod: null,
            items: [],
            totalTitles: 0,
            totalItems: 0,
            totalAmount: 0,
        }))

        // 3. Regresa el foco al buscador para el siguiente libro
        setTimeout(() => {
            searchInputRef.current?.focus()
        }, 100)
    }


    // Función auxiliar para mantener los totales centralizados
    const recalculateTotals = (
        prevPayload: QuickSalePayload,
        updatedItems: SaleItem[]
    ): QuickSalePayload => {
        const totalTitles = updatedItems.length
        const totalItems = updatedItems.reduce((acc, curr) => acc + curr.quantity, 0)
        const totalAmount = Number(
            updatedItems.reduce((acc, curr) => acc + curr.subtotal, 0).toFixed(2)
        )

        return {
            ...prevPayload,
            items: updatedItems,
            totalTitles,
            totalItems,
            totalAmount,
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col relative bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
            <Navbar showBackButton />

            <main className="flex-1! max-w-lg! w-full! mx-auto! p-3! max-sm:space-y-1! sm:space-y-3!">
                {/* Encabezado Módulo */}
                <div className="flex! items-center! gap-2! max-sm:h-11!">
                    <div className="p-1.5! rounded-lg! bg-emerald-500/10! text-emerald-600!">
                        <Zap className="w-5! h-5!" />
                    </div>
                    <h1 className="text-lg! font-bold! tracking-tight">Venta Rápida</h1>
                </div>

                {/* FILA 1: Buscador con autoclean y botón */}
                <form onSubmit={handleSearchSubmit} className="flex! gap-2!">
                    <div className="relative! flex-1!">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            ref={searchInputRef} //👈 4. Asignar el ref aquí en la etiqueta Input
                            type="text"
                            placeholder={
                                isWarehouseSelected
                                    ? 'Escanea ISBN o escribe libro...'
                                    : '⚠️ Selecciona un almacén para buscar'
                            }
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={!isWarehouseSelected || isLoadingSearch} // 👈 Bloqueado si no hay almacén
                            className="pl-9 pr-8 bg-background h-10 text-xs shadow-sm"
                        />
                        {inputValue && isWarehouseSelected && (
                            <button
                                type="button"
                                onClick={() => setInputValue('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <Button
                        type="submit"
                        disabled={!isWarehouseSelected || isLoadingSearch} // 👈 Bloqueado
                        className="h-10 px-4 text-xs font-semibold"
                    >
                        Buscar
                    </Button>
                </form>

                {/* FILA 2: Combo Almacén + Botón Observaciones */}
                <div className="grid grid-cols-2 gap-2">
                    {/* Select Dinámico de Almacenes */}
                    <select
                        value={salePayload.warehouseCode}
                        onChange={(e) => handleWarehouseChange(e.target.value)}
                        disabled={isLoadingWarehouses}
                        className={`h-9 w-full text-xs rounded-md border bg-background px-2.5 font-semibold shadow-sm transition-colors ${!isWarehouseSelected
                            ? 'border-amber-500 text-amber-600 bg-amber-50/50 dark:bg-amber-950/20'
                            : ''
                            }`}
                    >
                        <option value="" disabled>
                            {isLoadingWarehouses ? 'Cargando almacenes...' : '-- Seleccionar Almacén --'}
                        </option>
                        {warehouses.map((w) => (
                            <option key={w.id} value={w.code}>
                                {w.name} ({w.code})
                            </option>
                        ))}
                    </select>

                    {/* Botón Observaciones */}
                    <Button
                        type="button"
                        variant={salePayload.observations ? 'default' : 'outline'}
                        size="sm"
                        disabled={!isWarehouseSelected} // 👈 Bloqueado si no hay almacén
                        onClick={() => {
                            setTempObs(salePayload.observations || '')
                            setIsObsModalOpen(true)
                        }}
                        className="h-9 text-xs flex items-center justify-center gap-1.5 truncate"
                    >
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                            {salePayload.observations ? 'Obs. registradas' : 'Observaciones'}
                        </span>
                    </Button>
                </div>

                {/* FILA 3: Botón Cliente */}
                <Button
                    type="button"
                    variant={salePayload.customer ? 'secondary' : 'outline'}
                    disabled={!isWarehouseSelected} // 👈 Bloqueado si no hay almacén
                    onClick={() => setIsCustomerModalOpen(true)}
                    className="w-full h-10 text-xs font-semibold flex items-center justify-center gap-2 border-dashed border-2"
                >
                    <UserPlus className="w-4 h-4 text-emerald-600" />
                    <span className="truncate max-w-[280px]">{getCustomerButtonLabel()}</span>
                </Button>

                {/* LISTA DE PRODUCTOS AGREGADOS AL CARRITO */}
                <div className="space-y-2 max-sm:pt-0 sm:pt-2">
                    {salePayload.items.length === 0 ? (
                        <div className="p-8 border-2 border-dashed rounded-xl bg-card text-center text-xs text-muted-foreground">
                            No hay productos en la venta actual. Usa el buscador superior para agregar.
                        </div>
                    ) : (
                        salePayload.items.map((item) => (
                            <SaleItemCard
                                key={item.productCod}
                                item={item}
                                onUpdateQuantity={handleUpdateQuantity}
                                onUpdateUnitPrice={handleUpdateUnitPrice}
                                onRemoveItem={handleRemoveItem}
                            />
                        ))
                    )}
                </div>

                {/* FOOTER ESTÁTICO MÓVIL (STICKY BOTTOM) */}
                <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur shadow-lg p-3 z-20">
                    <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
                        {/* Resumen de Títulos y Unidades Totales */}
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                <span>Títulos: <strong className="text-foreground">{salePayload.totalTitles}</strong></span>
                                <span>•</span>
                                <span>Unids: <strong className="text-foreground">{salePayload.totalItems}</strong></span>
                            </div>
                            <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                                S/ {salePayload.totalAmount.toFixed(2)}
                            </div>
                        </div>

                        {/* Botón Principal Vender */}
                        <Button
                            size="lg"
                            disabled={!isWarehouseSelected || salePayload.items.length === 0}
                            onClick={() => {
                                handleOpenPaymentModal()
                                // console.log('Payload listo para enviar/modal de pago:', salePayload)
                                // Aquí dispararemos el modal de método de pago en la siguiente etapa
                            }}
                            className="px-6 font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                        >
                            Vender
                        </Button>
                    </div>
                </div>
            </main>

            {/* Modal 1: Selección Múltiple con Paginación */}
            <ProductSelectionModal
                open={isSelectionModalOpen}
                // onClose={() => setIsSelectionModalOpen(false)}
                onClose={handleCloseSelectionModal}
                products={searchResults}
                totalRecords={totalSearchResults}
                currentPage={modalSearchPage}
                onPageChange={handleModalPageChange}
                // onSelectProduct={(product) => {
                //     addProductToCart(product)
                //     setInputValue('') // Autoclean
                // }}
                onSelectProduct={handleSelectProductFromModal}
                isLoading={isLoadingSearch}
            />

            {/* Modal 2: Alerta cuando NO se encuentran productos */}
            {/* <Dialog open={isNotFoundModalOpen} onOpenChange={setIsNotFoundModalOpen}> */}
            <Dialog open={isNotFoundModalOpen} onOpenChange={handleCloseNotFoundModal}>
                <DialogContent className="max-w-xs w-[90vw] rounded-xl p-4 text-center">
                    <DialogHeader className="items-center space-y-2">
                        <div className="p-2.5 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-base font-bold">Sin coincidencias</DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            No se encontraron productos para <strong className="text-foreground">"{inputValue}"</strong> en el almacén seleccionado.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="pt-2 sm:justify-center">
                        <Button
                            size="sm"
                            // onClick={() => setIsNotFoundModalOpen(false)}
                            onClick={handleCloseNotFoundModal}
                            className="w-full text-xs font-semibold"
                        >
                            Entendido
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Observaciones */}
            <Dialog open={isObsModalOpen} onOpenChange={setIsObsModalOpen}>
                <DialogContent className="max-w-md! w-[95vw]! rounded-xl! p-4!">
                    <DialogHeader>
                        <DialogTitle className="text-base! font-bold!">Observaciones de la Venta</DialogTitle>
                    </DialogHeader>
                    <textarea
                        value={tempObs}
                        onChange={(e) => setTempObs(e.target.value)}
                        placeholder="Escribe detalles o notas adicionales para esta venta..."
                        className="w-full! h-24! p-2! text-xs! border! rounded-md! bg-background! focus:outline-none! focus:ring-1! focus:ring-primary!"
                    />
                    <DialogFooter className="flex-row! gap-2! justify-end!">
                        <Button variant="outline" size="sm" onClick={() => setIsObsModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button size="sm" onClick={handleSaveObservations}>
                            Guardar Nota
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Cliente */}
            <CustomerModal
                open={isCustomerModalOpen}
                onClose={() => setIsCustomerModalOpen(false)}
                onSave={handleSaveCustomer}
                initialData={salePayload.customer}
            />

            {/* Modal de Método de Pago */}
            <PaymentMethodModal
                open={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                totalAmount={salePayload.totalAmount}
                onConfirmSale={handleConfirmSale}
            />
        </div>
    )
}