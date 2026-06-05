import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import DataTable from '@/components/admin/DataTable'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'

import * as categoriaService from '@/services/categoriaService'

const EMPTY_FORM = { nombre: '', descripcion: '' }

function validate(form) {
  const errors = {}
  if (!form.nombre.trim()) errors.nombre = 'El nombre es obligatorio.'
  return errors
}

export default function CategoriesAdminPage() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await categoriaService.listAll()
      setCategorias(data)
    } catch {
      toast.error('Error al cargar las categorías.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setFormErrors({})
    setDialogOpen(true)
  }

  const openEdit = (row) => {
    setEditTarget(row)
    setForm({ nombre: row.nombre ?? '', descripcion: row.descripcion ?? '' })
    setFormErrors({})
    setDialogOpen(true)
  }

  const handleField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setFormErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async () => {
    const errors = validate(form)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setSaving(true)
    try {
      const payload = {
        nombre: form.nombre.trim(),
        slug: form.nombre
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, ''),
        descripcion: form.descripcion.trim() || null,
      }

      if (editTarget) {
        await categoriaService.update(editTarget.id, payload)
        toast.success('Categoría actualizada.')
      } else {
        await categoriaService.create(payload)
        toast.success('Categoría creada.')
      }
      setDialogOpen(false)
      loadData()
    } catch (err) {
      const status = err?.response?.status
      const msg = err?.response?.data?.error?.message ?? err?.response?.data?.error ?? 'Error al guardar.'
      if (status === 409) {
        toast.error('Ya existe una categoría con ese nombre.')
      } else {
        toast.error(typeof msg === 'string' ? msg : 'Error al guardar.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await categoriaService.softDelete(deleteTarget.id)
      toast.success('Categoría desactivada.')
      setDeleteTarget(null)
      loadData()
    } catch (err) {
      const status = err?.response?.status
      if (status === 400 || status === 409) {
        toast.error(
          'No podés eliminar una categoría con productos activos. Primero desactiválos.'
        )
      } else {
        toast.error('Error al desactivar la categoría.')
      }
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { header: 'Nombre', accessor: 'nombre' },
    {
      header: 'Descripción',
      accessor: 'descripcion',
      cell: (row) => (
        <span className="text-[#F4EFE4]/60 text-sm">{row.descripcion || '—'}</span>
      ),
    },
    {
      header: 'Estado',
      accessor: 'activo',
      cell: (row) =>
        row.activo !== false ? (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border text-xs">
            Activo
          </Badge>
        ) : (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 border text-xs">
            Inactivo
          </Badge>
        ),
    },
    {
      header: 'Acciones',
      accessor: '_actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-[#C9A227] hover:bg-[#C9A227]/10"
            onClick={() => openEdit(row)}
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          {row.activo !== false && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-red-400 hover:bg-red-400/10"
              onClick={() => setDeleteTarget(row)}
              title="Desactivar"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-[#0B0B0F] p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-[#C9A227]">Categorías</h1>
          <Button
            onClick={openCreate}
            className="bg-[#C9A227] text-[#0A1628] hover:bg-[#E0C56A] font-semibold"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Nueva categoría
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={categorias}
          loading={loading}
          emptyMessage="No hay categorías registradas."
        />
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#16161D] border border-[#C9A227]/30 text-[#F4EFE4] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#C9A227]">
              {editTarget ? 'Editar categoría' : 'Nueva categoría'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="text-[#F4EFE4]/80 mb-1 block">
                Nombre <span className="text-red-400">*</span>
              </Label>
              <Input
                value={form.nombre}
                onChange={handleField('nombre')}
                className="bg-[#0B0B0F] border-[#C9A227]/30 text-[#F4EFE4]"
              />
              {formErrors.nombre && (
                <p className="text-red-400 text-xs mt-1">{formErrors.nombre}</p>
              )}
            </div>
            <div>
              <Label className="text-[#F4EFE4]/80 mb-1 block">Descripción</Label>
              <Textarea
                value={form.descripcion}
                onChange={handleField('descripcion')}
                rows={3}
                className="bg-[#0B0B0F] border-[#C9A227]/30 text-[#F4EFE4] resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
              className="border-[#C9A227]/30 text-[#F4EFE4]/80 hover:bg-[#C9A227]/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-[#C9A227] text-[#0A1628] hover:bg-[#E0C56A] font-semibold"
            >
              {saving ? 'Guardando…' : editTarget ? 'Guardar cambios' : 'Crear categoría'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm deactivate */}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="¿Desactivar categoría?"
        description={`La categoría "${deleteTarget?.nombre}" se desactivará. Si tiene productos activos, la operación será rechazada.`}
        confirmLabel="Desactivar"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
