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
import DataTable from '@/components/admin/DataTable'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import RoleSelect from '@/components/admin/RoleSelect'

import * as usuarioService from '@/services/usuarioService'
import { formatDate } from '@/lib/formatters'
import { useAuth } from '@/hooks/useAuth'
import { useDebounce } from '@/hooks/useDebounce'

const EMPTY_FORM = {
  nombre: '',
  email: '',
  password: '',
  rol: 'cliente',
}

const ROLE_BADGE = {
  'super-admin': 'bg-red-500/20 text-red-400 border-red-500/30',
  admin: 'bg-[#C9A227]/20 text-[#C9A227] border-[#C9A227]/30',
  cliente: 'bg-[#F4EFE4]/10 text-[#F4EFE4]/70 border-[#F4EFE4]/20',
}

const ROLE_OPTIONS = [
  { value: '__all__', label: 'Todos los roles' },
  { value: 'cliente', label: 'Cliente' },
  { value: 'admin', label: 'Admin' },
  { value: 'super-admin', label: 'Super-Admin' },
]

function validate(form, isCreate) {
  const errors = {}
  if (!form.nombre.trim()) errors.nombre = 'El nombre es obligatorio.'
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Ingresá un email válido.'
  if (isCreate) {
    if (!form.password || form.password.length < 8)
      errors.password = 'La contraseña debe tener al menos 8 caracteres.'
  } else {
    if (form.password && form.password.length < 8)
      errors.password = 'Si vas a cambiar la contraseña, debe tener al menos 8 caracteres.'
  }
  if (!form.rol) errors.rol = 'El rol es obligatorio.'
  return errors
}

export default function UsersAdminPage() {
  const { user: currentUser } = useAuth()

  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [searchRaw, setSearchRaw] = useState('')
  const [filterRol, setFilterRol] = useState('__all__')
  const [showInactive, setShowInactive] = useState(false)

  const search = useDebounce(searchRaw, 350)

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)

  // Delete
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filterRol && filterRol !== '__all__') params.rol = filterRol
      const data = await usuarioService.listAll(params)
      setUsuarios(Array.isArray(data) ? data : data.items ?? [])
    } catch {
      toast.error('Error al cargar los usuarios.')
    } finally {
      setLoading(false)
    }
  }, [filterRol])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Client-side filtering for search and inactive
  const displayed = usuarios.filter((u) => {
    const matchesSearch =
      !search ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.nombre?.toLowerCase().includes(search.toLowerCase())
    const matchesActive = showInactive ? true : u.activo !== false
    return matchesSearch && matchesActive
  })

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
      email: row.email ?? '',
      password: '',
      rol: row.rol ?? 'cliente',
    })
    setFormErrors({})
    setDialogOpen(true)
  }

  const handleField = (field) => (e) => {
    const value = e.target ? e.target.value : e
    setForm((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async () => {
    const isCreate = !editTarget
    const errors = validate(form, isCreate)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setSaving(true)
    try {
      if (isCreate) {
        await usuarioService.create({
          nombre: form.nombre.trim(),
          email: form.email.trim(),
          password: form.password,
          rol: form.rol,
        })
        toast.success('Usuario creado.')
      } else {
        const payload = {
          nombre: form.nombre.trim(),
          email: form.email.trim(),
          rol: form.rol,
        }
        if (form.password) payload.password = form.password
        await usuarioService.update(editTarget.id, payload)
        toast.success('Usuario actualizado.')
      }
      setDialogOpen(false)
      loadData()
    } catch (err) {
      const status = err?.response?.status
      const msg = err?.response?.data?.error?.message ?? err?.response?.data?.error ?? 'Error.'
      if (status === 409) {
        toast.error('El email ya está registrado.')
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
      await usuarioService.softDelete(deleteTarget.id)
      toast.success('Usuario desactivado.')
      setDeleteTarget(null)
      loadData()
    } catch (err) {
      const status = err?.response?.status
      if (status === 400) {
        toast.error('No podés eliminarte a vos mismo.')
      } else if (status === 403) {
        toast.error('No podés eliminarte a vos mismo.')
      } else {
        toast.error('Error al desactivar el usuario.')
      }
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { header: 'ID', accessor: 'id', width: '60px' },
    {
      header: 'Nombre',
      accessor: 'nombre',
      cell: (row) => (
        <span className="font-medium text-[#F4EFE4]/90">{row.nombre}</span>
      ),
    },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Rol',
      accessor: 'rol',
      cell: (row) => (
        <Badge
          className={`border text-xs ${ROLE_BADGE[row.rol] ?? 'bg-[#16161D] text-[#F4EFE4]/50'}`}
        >
          {row.rol}
        </Badge>
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
      header: 'Creado',
      accessor: 'createdAt',
      cell: (row) => (
        <span className="text-[#F4EFE4]/50 text-xs">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      header: 'Acciones',
      accessor: '_actions',
      cell: (row) => {
        const isSelf = currentUser?.id === row.id
        return (
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
                className="h-7 w-7 text-red-400 hover:bg-red-400/10 disabled:opacity-30"
                onClick={() => !isSelf && setDeleteTarget(row)}
                disabled={isSelf}
                title={isSelf ? 'No podés desactivarte a vos mismo' : 'Desactivar'}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="min-h-screen bg-[#0B0B0F] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-[#C9A227]">Usuarios</h1>
          <Button
            onClick={openCreate}
            className="bg-[#C9A227] text-[#0A1628] hover:bg-[#E0C56A] font-semibold"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Nuevo usuario
          </Button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <Label className="text-[#F4EFE4]/70 text-xs mb-1 block">Buscar</Label>
            <Input
              placeholder="Email o nombre…"
              value={searchRaw}
              onChange={(e) => setSearchRaw(e.target.value)}
              className="bg-[#0B0B0F] border-[#C9A227]/30 text-[#F4EFE4] placeholder:text-[#F4EFE4]/30"
            />
          </div>
          <div className="min-w-[160px]">
            <Label className="text-[#F4EFE4]/70 text-xs mb-1 block">Rol</Label>
            <Select value={filterRol} onValueChange={setFilterRol}>
              <SelectTrigger className="bg-[#0B0B0F] border-[#C9A227]/30 text-[#F4EFE4]">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4]">
                {ROLE_OPTIONS.map((o) => (
                  <SelectItem
                    key={o.value}
                    value={o.value}
                    className="focus:bg-[#C9A227]/20"
                  >
                    {o.label}
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
          emptyMessage="No hay usuarios que coincidan con los filtros."
        />
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#16161D] border border-[#C9A227]/30 text-[#F4EFE4] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#C9A227]">
              {editTarget ? 'Editar usuario' : 'Nuevo usuario'}
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

            {/* Email */}
            <div>
              <Label className="text-[#F4EFE4]/80 mb-1 block">
                Email <span className="text-red-400">*</span>
              </Label>
              <Input
                type="email"
                value={form.email}
                onChange={handleField('email')}
                className="bg-[#0B0B0F] border-[#C9A227]/30 text-[#F4EFE4]"
              />
              {formErrors.email && (
                <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label className="text-[#F4EFE4]/80 mb-1 block">
                Contraseña{' '}
                {!editTarget && <span className="text-red-400">*</span>}
                {editTarget && (
                  <span className="text-[#F4EFE4]/40 text-xs font-normal ml-1">
                    (dejar vacío para no cambiar)
                  </span>
                )}
              </Label>
              <Input
                type="password"
                value={form.password}
                onChange={handleField('password')}
                placeholder={editTarget ? '••••••••' : 'Mínimo 8 caracteres'}
                className="bg-[#0B0B0F] border-[#C9A227]/30 text-[#F4EFE4]"
              />
              {formErrors.password && (
                <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
              )}
            </div>

            {/* Rol */}
            <div>
              <Label className="text-[#F4EFE4]/80 mb-1 block">
                Rol <span className="text-red-400">*</span>
              </Label>
              <RoleSelect
                value={form.rol}
                onChange={(v) => {
                  setForm((prev) => ({ ...prev, rol: v }))
                  setFormErrors((prev) => ({ ...prev, rol: undefined }))
                }}
              />
              {formErrors.rol && (
                <p className="text-red-400 text-xs mt-1">{formErrors.rol}</p>
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
              {saving ? 'Guardando…' : editTarget ? 'Guardar cambios' : 'Crear usuario'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm deactivate */}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="¿Desactivar usuario?"
        description={`El usuario "${deleteTarget?.nombre}" (${deleteTarget?.email}) no podrá iniciar sesión mientras esté inactivo.`}
        confirmLabel="Desactivar"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
