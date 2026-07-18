import React from 'react'

import type {
  HeaderGroup,
  RowData,
  SortDirection,
  TableFeatures,
  Header,
  Row,
  Cell,
} from '@tanstack/react-table'
import { SortAscIcon, SortDescIcon } from 'lucide-react'

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full overflow-auto rounded border bg-white text-black">
      <table className="w-full text-sm">{children}</table>
    </div>
  )
}

export function TableHead<TFeatures extends TableFeatures, TData extends RowData>({
  children,
  headerGroups,
}: {
  children: (headerGroup: HeaderGroup<TFeatures, TData>) => React.ReactNode
  headerGroups: Array<HeaderGroup<TFeatures, TData>>
}) {
  return (
    <thead>
      {headerGroups.map((headerGroup) => (
        <React.Fragment key={headerGroup.id}>{children(headerGroup)}</React.Fragment>
      ))}
    </thead>
  )
}

export function TableHeaderRow<TFeatures extends TableFeatures, TData extends RowData>({
  children,
  headers,
}: {
  children: (header: Header<TFeatures, TData>) => React.ReactNode
  headers: Array<Header<TFeatures, TData>>
}) {
  return (
    <tr className="">
      {headers.map((header) =>
        header.isPlaceholder ? null : (
          <React.Fragment key={header.id}>{children(header)}</React.Fragment>
        ),
      )}
    </tr>
  )
}

export function TableHeaderCell({ children }: { children: React.ReactNode }) {
  return <th className="border px-1 py-0">{children}</th>
}

export function TableHeaderSortIcon({ isSorted }: { isSorted: false | SortDirection }) {
  const className = 'ml-1 inline-block h-3 w-3'
  return isSorted === 'asc' ? (
    <SortAscIcon className={className} />
  ) : isSorted === 'desc' ? (
    <SortDescIcon className={className} />
  ) : null
}

export function TableBody<TFeatures extends TableFeatures, TData extends RowData>({
  children,
  rows,
}: {
  children: (row: Row<TFeatures, TData>) => React.ReactNode
  rows: Array<Row<TFeatures, TData>>
}) {
  return (
    <tbody>
      {rows.map((row) => (
        <React.Fragment key={row.id}>{children(row)}</React.Fragment>
      ))}
    </tbody>
  )
}

export function TableRow<TFeatures extends TableFeatures, TData extends RowData>({
  children,
  cells,
}: {
  children: (cell: Cell<TFeatures, TData>) => React.ReactNode
  cells: Array<Cell<TFeatures, TData>>
}) {
  return (
    <tr className="">
      {cells.map((cell) => (
        <React.Fragment key={cell.id}>{children(cell)}</React.Fragment>
      ))}
    </tr>
  )
}

export function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="border px-1 py-0">{children}</td>
}
