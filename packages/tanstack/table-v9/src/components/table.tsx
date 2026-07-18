import type { SortDirection } from '@tanstack/react-table'

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full overflow-auto rounded border bg-white text-black">
      <table className="w-full text-sm">{children}</table>
    </div>
  )
}

export function TableHeaderRow({ children }: { children: React.ReactNode }) {
  return <tr className="">{children}</tr>
}

export function TableHeader({
  children,
  isPlaceholder = false,
}: {
  children: React.ReactNode
  isPlaceholder?: boolean
}) {
  return <th className="border px-1 py-0">{isPlaceholder ? null : children}</th>
}

export function TableHeaderSortIcon({ isSorted }: { isSorted: false | SortDirection }) {
  return <span>{isSorted === 'asc' ? ' 🔼' : isSorted === 'desc' ? ' 🔽' : null}</span>
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="">{children}</tr>
}

export function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="border px-1 py-0">{children}</td>
}
