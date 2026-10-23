import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import {
    Banknote,
    CreditCard,
    QrCode,
    Smartphone,
    Landmark,
    CheckCircle2,
} from 'lucide-react'

export interface PaymentOption {
    code: 'CASH' | 'CRDN' | 'WMCH' | 'WPHN' | 'TRAN'
    label: string
    description: string
    icon: React.ElementType
    color: string
}

const PAYMENT_OPTIONS: PaymentOption[] = [
    {
        code: 'CASH',
        label: 'Efectivo',
        description: 'Pago con dinero físico',
        icon: Banknote,
        color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200',
    },
    {
        code: 'WMCH',
        label: 'Yape / Plin POS',
        description: 'Código QR mediante POS inalámbrico',
        icon: QrCode,
        color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200',
    },
    {
        code: 'WPHN',
        label: 'Yape / Plin Celular',
        description: 'Captura o recepción directa a número',
        icon: Smartphone,
        color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40 border-violet-200',
    },
    {
        code: 'CRDN',
        label: 'Tarjeta',
        description: 'Débito o Crédito vía terminal',
        icon: CreditCard,
        color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200',
    },
    {
        code: 'TRAN',
        label: 'Transferencia',
        description: 'Depósito a cuenta bancaria',
        icon: Landmark,
        color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 border-sky-200',
    },
]

interface PaymentMethodModalProps {
    open: boolean
    onClose: () => void
    totalAmount: number
    onConfirmSale: (selectedCode: string) => void
}

export function PaymentMethodModal({
    open,
    onClose,
    totalAmount,
    onConfirmSale,
}: PaymentMethodModalProps) {
    const [selectedMethod, setSelectedMethod] = useState<string>('CASH')

    const handleRegister = () => {
        onConfirmSale(selectedMethod)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md! w-[95vw]! rounded-2xl! p-4! sm:p-6!">
                <DialogHeader>
                    <DialogTitle className="text-base! font-bold! flex items-center! justify-between!">
                        <span>Método de Pago</span>
                        <span className="text-emerald-600! font-extrabold! text-lg!">
                            S/ {totalAmount.toFixed(2)}
                        </span>
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Selecciona la forma de cobro para procesar el comprobante.
                    </DialogDescription>
                </DialogHeader>

                {/* Lista de Tarjetas de Pago */}
                <div className="space-y-2 py-2">
                    {PAYMENT_OPTIONS.map((method) => {
                        const Icon = method.icon
                        const isSelected = selectedMethod === method.code

                        return (
                            <div
                                key={method.code}
                                onClick={() => setSelectedMethod(method.code)}
                                className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${isSelected
                                    ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 shadow-sm'
                                    : 'border-border bg-card hover:bg-muted/40'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg border ${method.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-foreground">
                                            {method.label}
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground">
                                            {method.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Checkbox Indicador */}
                                <div className="shrink-0">
                                    {isSelected ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <DialogFooter className="flex-row gap-2 justify-end pt-2 border-t">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="w-full sm:w-auto text-xs"
                    >
                        Cancelar
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleRegister}
                        className="w-full sm:w-auto text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        Registrar Venta
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}