import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ROLES = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'admin', label: 'Admin' },
  { value: 'super-admin', label: 'Super-Admin' },
]

/**
 * Role picker using shadcn Select.
 *
 * Props:
 *   value      {string}
 *   onChange   {(value: string) => void}
 *   disabled   {boolean}
 *   placeholder {string}
 */
export default function RoleSelect({ value, onChange, disabled = false, placeholder = 'Seleccioná un rol' }) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="bg-[#0B0B0F] border-[#C9A227]/30 text-[#F4EFE4]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4]">
        {ROLES.map((r) => (
          <SelectItem
            key={r.value}
            value={r.value}
            className="focus:bg-[#C9A227]/20 focus:text-[#F4EFE4]"
          >
            {r.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
