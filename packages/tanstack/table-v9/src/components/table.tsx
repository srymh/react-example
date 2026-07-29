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

const controllerPlaceholderBackgroundClassName =
  'bg-[repeating-linear-gradient(to_right,transparent,transparent_10px,#e5e7eb_10px,#e5e7eb_11px,transparent_11px,transparent_20px),repeating-linear-gradient(to_bottom,transparent,transparent_10px,#e5e7eb_10px,#e5e7eb_11px,transparent_11px,transparent_20px)]'

export function Table({
  children,
  className,
  style,
  fullWidth = true,
  renderTopController,
  renderBottomController,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  fullWidth?: boolean
  renderTopController?: React.ReactNode
  renderBottomController?: React.ReactNode
}) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded border border-black bg-white text-black">
      {renderTopController && (
        <div
          className={`w-full shrink-0 border-b border-black bg-gray-100 ${controllerPlaceholderBackgroundClassName}`}
        >
          {renderTopController}
        </div>
      )}

      <div className="min-h-0 w-full min-w-0 flex-1 overflow-hidden bg-white">
        <div className="flow-root h-[calc(100%+1px)] w-[calc(100%+1px)] overflow-auto overscroll-none bg-[repeating-linear-gradient(135deg,#f0f0f0,#f0f0f0_1px,transparent_1px,transparent_4px)]">
          <table
            className={`border-separate border-spacing-0 bg-white text-sm ${className ?? ''} ${fullWidth ? 'w-full' : ''}`}
            style={style}
          >
            {children}
          </table>
        </div>
      </div>

      {renderBottomController && (
        <div
          className={`w-full shrink-0 border-t border-black bg-gray-100 ${controllerPlaceholderBackgroundClassName}`}
        >
          {renderBottomController}
        </div>
      )}
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
  children: (header: Header<TFeatures, TData>, index: number) => React.ReactNode
  headers: Array<Header<TFeatures, TData>>
}) {
  return (
    <tr className="">
      {headers.map((header, index) =>
        header.isPlaceholder ? null : (
          <React.Fragment key={header.id}>{children(header, index)}</React.Fragment>
        ),
      )}
    </tr>
  )
}

export function TableHeaderCell({
  children,
  className,
  style,
  ref,
  colSpan,
  ...props
}: React.ComponentProps<'th'>) {
  return (
    <th
      className={`sticky top-0 border-r border-b border-black bg-white px-1 py-0 ${className ?? ''}`}
      style={style}
      ref={ref}
      colSpan={colSpan}
      {...props}
    >
      {children}
    </th>
  )
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

export function TableCell({ children, className, style, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      {...props}
      className={`border-r border-b border-black px-1 py-0 ${className ?? ''}`}
      style={style}
    >
      {children}
    </td>
  )
}
