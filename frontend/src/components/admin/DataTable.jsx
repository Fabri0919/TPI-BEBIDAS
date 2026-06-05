import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Generic admin data table.
 *
 * @param {{ header: string, accessor: string, cell?: (row) => ReactNode, width?: string }[]} columns
 * @param {object[]} data
 * @param {boolean} loading
 * @param {string} emptyMessage
 */
export default function DataTable({ columns, data, loading, emptyMessage = 'Sin resultados.' }) {
  return (
    <div className="rounded-md border border-[#C9A227]/30 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#C9A227]/20 bg-[#16161D] hover:bg-[#16161D]">
            {columns.map((col) => (
              <TableHead
                key={col.accessor}
                style={col.width ? { width: col.width } : undefined}
                className="text-[#C9A227] font-semibold text-xs uppercase tracking-wider"
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-b border-[#C9A227]/10 bg-[#0B0B0F]">
                {columns.map((col) => (
                  <TableCell key={col.accessor}>
                    <Skeleton className="h-4 w-full bg-[#F4EFE4]/10" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow className="bg-[#0B0B0F]">
              <TableCell
                colSpan={columns.length}
                className="text-center text-[#F4EFE4]/50 py-10"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, i) => (
              <TableRow
                key={row.id ?? i}
                className="border-b border-[#C9A227]/10 bg-[#0B0B0F] hover:bg-[#16161D] transition-colors"
              >
                {columns.map((col) => (
                  <TableCell key={col.accessor} className="text-[#F4EFE4]/90 text-sm py-3">
                    {col.cell ? col.cell(row) : row[col.accessor]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
