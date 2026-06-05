import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import DataTable from '@/components/admin/DataTable'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'

import * as productoService from '@/services/productoService'
import * as categoriaService from '@/services/categoriaService'
import { formatARS } from '@/lib/formatters'
import { useDebounce } from '@/hooks/useDebounce'

const SUBCATEGORIAS = ['Blend', 'Single Malt', 'American', 'Irish']

const EMPTY_FORM = {
  nombre: '',
  descripcion: '',
  categoria_id: '',
  sub_categoria: '',
  volumen_ml: '',
  precio_pesos: '',
  stock: '',
  imagen_url: '',
}

function validate(form, isWhisky) {
  const errors = {}
  if (!form.nombre.trim()) errors.nombre = 'El nombre es obligatorio.'
  const precio = parseFloat(form.precio_pesos)
  if (!form.precio_pesos || isNaN(precio) || precio <= 0)
    errors.precio_pesos = 'El precio debe ser mayor a 0.'
  const stock = parseInt(form.stock, 10)
  if (form.stock === '' || isNaN(stock) || stock < 0)
    errors.stock = 'El stock debe ser un número entero >= 0.'
  if (!form.categoria_id) errors.categoria_id = 'La categoría es obligatoria.'
  if (isWhisky && !form.sub_categoria)
    errors.sub_categoria = 'La subcategoría es obligatoria para Whisky.'
  if (
    form.imagen_url &&
    form.imagen_url.trim() !== '' &&
    !/^https?:\/\/.+/.test(form.imagen_url.trim())
  )
    errors.imagen_url = 'Ingresá una URL válida.'
  return errors
}

export default function ProductsAdminPage() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchRaw, setSearchRaw] = useState('')
  const [filterCat, setFilterCat] = useState('__all__')
  const [showInactive, setShowInactive] = useState(false)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null) // null = create
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const search = useDebounce(searchRaw, 350)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [prodsData, catsData] = await Promise.all([
        productoService.list({
          includeInactive: true,
          includeOutOfStock: true,
          ...(search ? { search } : {}),
          ...(filterCat && filterCat !== '__all__' ? { categoriaId: filterCat } : {}),
        }),
        categoriaService.listAll(),
      ])
      setProductos(prodsData.items ?? prodsData)
      setCategorias(catsData)
    } catch {
      toast.error('Error al cargar los productos.')
    } finally {
      setLoading(false)
    }
  }, [search, filterCat])

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
    setForm({
      nombre: row.nombre ?? '',
      descripcion: row.descripcion ?? '',
      categoria_id: String(row.categoria_id ?? row.categoriaId ?? ''),
      sub_categoria: row.subcategoria ?? '',
      volumen_ml: String(row.volumen_ml ?? ''),
      precio_pesos: row.precio_centavos ? String(row.precio_centavos / 100) : '',
      stock: String(row.stock ?? ''),
      imagen_url: row.imagen_url ?? '',
    })
    setFormErrors({})
    setDialogOpen(true)
  }

  const handleField = (field) => (e) => {
    const value = e.target ? e.target.value : e
    setForm((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const selectedCat = categorias.find((c) => String(c.id) === String(form.categoria_id))
  const isWhisky = selectedCat?.nombre?.toLowerCase() === 'whisky'

  const handleSubmit = async () => {
    const errors = validate(form, isWhisky)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setSaving(true)
    try {
      const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || null,
        categoria_id: parseInt(form.categoria_id, 10),
        subcategoria: isWhisky ? form.sub_categoria : null,
        volumen_ml: form.volumen_ml ? parseInt(form.volumen_ml, 10) : null,
        precio_centavos: Math.round(parseFloat(form.precio_pesos) * 100),
        stock: parseInt(form.stock, 10),
        imagen_url: form.imagen_url.trim() || null,
      }

      if (editTarget) {
        await productoService.update(editTarget.id, payload)
        toast.success('Producto actualizado.')
      } else {
        await productoService.create(payload)
        toast.success('Producto creado.')
      }
      setDialogOpen(false)
      loadData()
    } catch (err) {
      const msg = err?.response?.data?.error?.message ?? 'Error al guardar el producto.'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await productoService.softDelete(deleteTarget.id)
      toast.success('Producto desactivado.')
      setDeleteTarget(null)
      loadData()
    } catch (err) {
      const msg = err?.response?.data?.error?.message ?? 'Error al desactivar el producto.'
      toast.error(msg)
    } finally {
      setDeleting(false)
    }
  }

  const displayed = showInactive
    ? productos
    : productos.filter((p) => p.activo !== false)

  const catName = (row) => {
    const cat = categorias.find((c) => c.id === (row.categoria_id ?? row.categoriaId))
    return cat?.nombre ?? '—'
  }

  const columns = [
    {
      header: 'Imagen',
      accessor: 'imagen_url',
      width: '60px',
      cell: (row) =>
        row.imagen_url ? (
          <img
            src={row.imagen_url}
            alt={row.nombre}
            className="h-10 w-10 rounded object-cover border border-[#C9A227]/20"
          />
        ) : (
          <div className="h-10 w-10 rounded bg-[#16161D] border border-[#C9A227]/20 flex items-center justify-center text-[#F4EFE4]/30 text-xs">
            N/A
          </div>
        ),
    },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Categoría', accessor: '_cat', cell: catName },
    {
      header: 'Subcategoría',
      accessor: 'subcategoria',
      cell: (row) => row.subcategoria ?? '—',
    },
    {
      header: 'Volumen',
      accessor: 'volumen_ml',
      cell: (row) => (row.volumen_ml ? `${row.volumen_ml} ml` : '—'),
    },
    {
      header: 'Precio',
      accessor: 'precio_centavos',
      cell: (row) => formatARS(row.precio_centavos),
    },
    {
      header: 'Stock',
      accessor: 'stock',
      cell: (row) => (
        <span className={row.stock === 0 ? 'text-red-400 font-semibold' : ''}>
          {row.stock}
        </span>
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-[#C9A227]">Productos</h1>
          <Button
            onClick={openCreate}
            className="bg-[#C9A227] text-[#0A1628] hover:bg-[#E0C56A] font-semibold"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Nuevo producto
          </Button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <Label className="text-[#F4EFE4]/70 text-xs mb-1 block">Buscar</Label>
            <Input
              placeholder="Nombre del producto…"
              value={searchRaw}
              onChange={(e) => setSearchRaw(e.target.value)}
              className="bg-[#0B0B0F] border-[#C9A227]/30 text-[#F4EFE4] placeholder:text-[#F4EFE4]/30"
            />
          </div>
          <div className="min-w-[160px]">
            <Label className="text-[#F4EFE4]/70 text-xs mb-1 block">Categoría</Label>
            <Select value={filterCat} onValueChange={setFilterCat}>
              <SelectTrigger className="bg-[#0B0B0F] border-[#C9A227]/30 text-[#F4EFE4]">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent className="bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4]">
                <SelectItem value="__all__" className="focus:bg-[#C9A227]/20">
                  Todas
                </SelectItem>
                {categorias.map((c) => (
                  <SelectItem
                    key={c.id}
                    value={String(c.id)}
                    className="focus:bg-[#C9A227]/20"
                  >
                    {c.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-center gap-2 text-[#F4EFE4]/70 text-sm cursor-pointer select-none pb-0.5">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="accent-[#C9A227]"
            />
            Ver inactivos
          </label>
        </div>

        <DataTable
          columns={columns}
          data={displayed}
          loading={loading}
          emptyMessage="No hay productos que coincidan con los filtros."
        />
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#16161D] border border-[#C9A227]/30 text-[#F4EFE4] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#C9A227]">
              {editTarget ? 'Editar producto' : 'Nuevo producto'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Nombre */}
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

            {/* Descripción */}
            <div>
              <Label className="text-[#F4EFE4]/80 mb-1 block">Descripción</Label>
              <Textarea
                value={form.descripcion}
                onChange={handleField('descripcion')}
                rows={3}
                className="bg-[#0B0B0F] border-[#C9A227]/30 text-[#F4EFE4] resize-none"
              />
            </div>

            {/* Categoría */}
            <div>
              <Label className="text-[#F4EFE4]/80 mb-1 block">
                Categoría <span className="text-red-400">*</span>
              </Label>
              <Select
                value={form.categoria_id}
                onValueChange={(v) => {
                  setForm((prev) => ({ ...prev, categoria_id: v, sub_categoria: '' }))
                  setFormErrors((prev) => ({ ...prev, categoria_id: undefined }))
                }}
              >
                <SelectTrigger className="bg-[#0B0B0F] border-[#C9A227]/30 text-[#F4EFE4]">
                  <SelectValue placeholder="Seleccioná una categoría" />
                </SelectTrigger>
                <SelectContent className="bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4]">
                  {categorias
                    .filter((c) => c.activo !== false)
                    .map((c) => (
                      <SelectItem
                        key={c.id}
                        value={String(c.id)}
                        className="focus:bg-[#C9A227]/20"
                      >
                        {c.nombre}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {formErrors.categoria_id && (
                <p className="text-red-400 text-xs mt-1">{formErrors.categoria_id}</p>
              )}
            </div>

            {/* Subcategoría — solo si Whisky */}
            {isWhisky && (
              <div>
                <Label className="text-[#F4EFE4]/80 mb-1 block">
                  Subcategoría <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={form.sub_categoria}
                  onValueChange={(v) => {
                    setForm((prev) => ({ ...prev, sub_categoria: v }))
                    setFormErrors((prev) => ({ ...prev, sub_categoria: undefined }))
                  }}
                >
                  <SelectTrigger className="bg-[#0B0B0F] border-[#C9A227]/30 text-[#F4EFE4]">
                    <SelectValue placeholder="Seleccioná una subcategoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4]">
                    {SUBCATEGORIAS.map((s) => (
                      <SelectItem key={s} value={s} className="focus:bg-[#C9A227]/20">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.sub_categoria && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.sub_categoria}</p>
                )}
              </div>
            )}

            {/* Volumen */}
            <div>
              <Label className="text-[#F4EFE4]/80 mb-1 block">Volumen (ml)</Label>
              <Input
                type="number"
                min="1"
                value={form.volumen_ml}
                onChange={handleField('volumen_ml')}
                className="bg-[#0B0B0F] border-[#C9A227]/30 text-[#F4EFE4]"
              />
            </div>

            {/* Precio en pesos */}
            <div>
              <Label className="text-[#F4EFE4]/80 mb-1 block">
                Precio en pesos <span className="text-red-400">*</span>
              </Label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={form.precio_pesos}
                onChange={handleField('precio_pesos')}
                className="bg-[#0B0B0F] border-[#C9A227]/30 text-[#F4EFE4]"
                placeholder="Ej: 32000"
              />
              {formErrors.precio_pesos && (
                <p className="text-red-400 text-xs mt-1">{formErrors.precio_pesos}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <Label className="text-[#F4EFE4]/80 mb-1 block">
                Stock <span className="text-red-400">*</span>
              </Label>
              <Input
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={handleField('stock')}
                className="bg-[#0B0B0F] border-[#C9A227]/30 text-[#F4EFE4]"
              />
              {formErrors.stock && (
                <p className="text-red-400 text-xs mt-1">{formErrors.stock}</p>
              )}
            </div>

            {/* Imagen URL */}
            <div>
              <Label className="text-[#F4EFE4]/80 mb-1 block">URL de imagen</Label>
              <Input
                type="url"
                value={form.imagen_url}
                onChange={handleField('imagen_url')}
                placeholder="https://…"
                className="bg-[#0B0B0F] border-[#C9A227]/30 text-[#F4EFE4]"
              />
              {formErrors.imagen_url && (
                <p className="text-red-400 text-xs mt-1">{formErrors.imagen_url}</p>
              )}
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
              {saving ? 'Guardando…' : editTarget ? 'Guardar cambios' : 'Crear producto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm deactivate */}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="¿Desactivar producto?"
        description={`El producto "${deleteTarget?.nombre}" dejará de aparecer en el catálogo pero sus pedidos históricos quedarán intactos.`}
        confirmLabel="Desactivar"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
