import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

/**
 * Reusable soft-delete confirmation dialog.
 *
 * Props:
 *   open        {boolean}
 *   onOpenChange {(open: boolean) => void}
 *   title       {string}
 *   description {string}
 *   onConfirm   {() => void | Promise<void>}
 *   loading     {boolean}
 *   confirmLabel {string}  default "Eliminar"
 */
export default function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title = '¿Estás seguro?',
  description = 'Esta acción no se puede deshacer.',
  onConfirm,
  loading = false,
  confirmLabel = 'Eliminar',
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#16161D] border border-[#C9A227]/30 text-[#F4EFE4]">
        <DialogHeader>
          <DialogTitle className="text-[#F4EFE4]">{title}</DialogTitle>
          <DialogDescription className="text-[#F4EFE4]/60">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="border-[#C9A227]/30 text-[#F4EFE4]/80 hover:bg-[#C9A227]/10"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? 'Procesando…' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
