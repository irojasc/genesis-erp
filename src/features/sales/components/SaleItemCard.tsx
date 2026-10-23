import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Plus, Minus, Trash2, Edit2, Check } from 'lucide-react'
import type { SaleItem } from '../types/quick-sales.types'

interface SaleItemCardProps {
    item: SaleItem;
    onUpdateQuantity: (productCod: string, delta: number) => void;
    onUpdateUnitPrice: (productCod: string, newPrice: number) => void;
    onRemoveItem: (productCod: string) => void;
}

export function SaleItemCard({
    item,
    onUpdateQuantity,
    onUpdateUnitPrice,
    onRemoveItem,
}: SaleItemCardProps) {
    const [isEditingPrice, setIsEditingPrice] = useState(false)
    const [tempPrice, setTempPrice] = useState(item.unitPrice.toString())

    const handleSavePrice = () => {
        const parsed = parseFloat(tempPrice)
        if (!isNaN(parsed) && parsed > 0) {
            onUpdateUnitPrice(item.productCod, parsed)
        } else {
            setTempPrice(item.unitPrice.toString())
        }
        setIsEditingPrice(false)
    }

    return (
        <div className="p-3! rounded-xl! border! bg-card! shadow-sm! space-y-2! text-xs!">
            {/* Título y Botón Eliminar */}
            <div className="flex! items-start! justify-between! gap-2!">
                <div>
                    <h4 className="font-bold! text-foreground! line-clamp-2! leading-snug!">
                        {item.title}
                    </h4>
                    <p className="text-[11px]! text-muted-foreground! truncate!">
                        {item.author} • <span className="italic">{item.publisher}</span>
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(item.productCod)}
                    className="h-7 w-7 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </Button>
            </div>

            {/* Códigos Identificadores */}
            <div className="font-mono text-[10px] text-muted-foreground bg-muted/30 px-2 py-0.5 rounded w-fit">
                CÓD: {item.productCod} | ISBN: {item.isbn}
            </div>

            {/* Controles de Cantidad, Precio Unitario Editable y Subtotal */}
            <div className="flex items-center justify-between pt-2 border-t border-dashed">
                {/* Contador de Cantidad */}
                <div className="flex items-center border rounded-lg bg-background overflow-hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onUpdateQuantity(item.productCod, -1)}
                        disabled={item.quantity <= 1}
                        className="h-7 w-7 rounded-none border-r text-muted-foreground hover:text-foreground"
                    >
                        <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-bold text-xs">{item.quantity}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onUpdateQuantity(item.productCod, 1)}
                        className="h-7 w-7 rounded-none border-l text-muted-foreground hover:text-foreground"
                    >
                        <Plus className="w-3 h-3" />
                    </Button>
                </div>

                {/* Precio Unitario Editable */}
                <div className="flex items-center gap-1">
                    {isEditingPrice ? (
                        <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">S/</span>
                            <Input
                                type="number"
                                step="0.10"
                                min="0.01"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                onBlur={handleSavePrice}
                                onKeyDown={(e) => e.key === 'Enter' && handleSavePrice()}
                                className="h-7 w-16 px-1 text-xs text-right font-bold"
                                autoFocus
                            />
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={handleSavePrice}
                                className="h-7 w-7 text-emerald-600"
                            >
                                <Check className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                setTempPrice(item.unitPrice.toString())
                                setIsEditingPrice(true)
                            }}
                            className="flex items-center gap-1 text-muted-foreground hover:text-foreground font-medium p-1 rounded hover:bg-muted"
                            title="Click para editar precio unitario"
                        >
                            <span>P.U: S/ {item.unitPrice.toFixed(2)}</span>
                            <Edit2 className="w-3 h-3 text-muted-foreground" />
                        </button>
                    )}
                </div>

                {/* Subtotal del Ítem */}
                <div className="text-right">
                    <span className="text-[10px] text-muted-foreground block">Subtotal</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                        S/ {item.subtotal.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    )
}