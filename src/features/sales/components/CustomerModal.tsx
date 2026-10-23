// src/features/sales/components/CustomerModal.tsx
import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Checkbox } from '../../../components/ui/checkbox'
import type { CustomerData } from '../types/quick-sales.types'

interface CustomerModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (customer: CustomerData) => void;
    initialData: CustomerData | null;
}

export function CustomerModal({ open, onClose, onSave, initialData }: CustomerModalProps) {
    const [formData, setFormData] = useState<CustomerData>(
        initialData || {
            wantsReceipt: false,
            docType: 'DNI',
            docNumber: '',
            name: '',
            phone: '',
            email: '',
        }
    )

    const handleSave = () => {
        const hasDoc = Boolean(formData.docType && formData.docNumber.trim())
        const hasName = Boolean(formData.name.trim())
        const hasPhone = Boolean(formData.phone?.trim())
        const hasEmail = Boolean(formData.email?.trim())

        // CASO 1: Si "Desea recibo?" está ACTIVADO
        if (formData.wantsReceipt) {
            // Exige MÍNIMO teléfono O correo completado (los demás datos pueden ir vacíos)
            if (!hasPhone && !hasEmail) {
                alert('Si desea recibo, debe ingresar al menos un teléfono o un correo electrónico.')
                return
            }
        }
        // CASO 2: Si "Desea recibo?" está DESACTIVADO
        else {
            // Exige MÍNIMO alguno de los campos: (Tipo doc + Num doc) O Nombre O Teléfono O Correo
            const hasAnyField = hasDoc || hasName || hasPhone || hasEmail

            if (!hasAnyField) {
                alert('Debe ingresar al menos un dato (Documento completo, Nombre, Teléfono o Correo) para guardar el cliente.')
                return
            }
        }

        // Si pasa la validación
        onSave(formData)
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md! w-[95vw]! rounded-xl! p-4! sm:p-6!">
                <DialogHeader>
                    <DialogTitle className="text-base! font-bold!">Datos del Cliente</DialogTitle>
                </DialogHeader>

                <div className="space-y-4! py-2!">
                    {/* Checkbox Recibo */}
                    <div className="flex! items-center! space-x-2! bg-muted/40! p-3! rounded-lg! border!">
                        <Checkbox
                            id="receipt"
                            checked={formData.wantsReceipt}
                            onCheckedChange={(checked) =>
                                setFormData((prev) => ({ ...prev, wantsReceipt: !!checked }))
                            }
                        />
                        <Label htmlFor="receipt" className="text-xs font-semibold cursor-pointer">
                            ¿Desea comprobante / recibo?
                        </Label>
                    </div>

                    {/* Tipo y Nro de Documento */}
                    <div className="grid! grid-cols-3! gap-2!">
                        <div className="space-y-1!">
                            <Label className="text-xs!">Tipo Doc {formData.wantsReceipt && '*'}</Label>
                            <select
                                value={formData.docType}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, docType: e.target.value as any }))
                                }
                                className="w-full h-9 text-xs rounded-md border bg-background px-2"
                            >
                                <option value="DNI">DNI</option>
                                <option value="RUC">RUC</option>
                                <option value="C.E.">C.E.</option>
                                <option value="PAS">PAS</option>
                            </select>
                        </div>
                        <div className="col-span-2 space-y-1">
                            <Label className="text-xs">N° Documento {formData.wantsReceipt && '*'}</Label>
                            <Input
                                placeholder="Ej. 70654321"
                                value={formData.docNumber}
                                onChange={(e) => setFormData((prev) => ({ ...prev, docNumber: e.target.value }))}
                                className="h-9 text-xs"
                            />
                        </div>
                    </div>

                    {/* Nombre / Razón Social */}
                    <div className="space-y-1">
                        <Label className="text-xs">Nombre / Razón Social {formData.wantsReceipt && '*'}</Label>
                        <Input
                            placeholder="Nombre completo"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            className="h-9 text-xs"
                        />
                    </div>

                    {/* Teléfono y Correo */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-xs">Teléfono</Label>
                            <Input
                                placeholder="987654321"
                                value={formData.phone}
                                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                                className="h-9 text-xs"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Correo</Label>
                            <Input
                                placeholder="cliente@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                className="h-9 text-xs"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex-row gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={onClose} className="w-full sm:w-auto">
                        Cancelar
                    </Button>

                    <Button size="sm" onClick={handleSave} className="w-full sm:w-auto">
                        Guardar Cliente
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}