import type { RowData, Table, TableFeatures, Table_CellSelection } from '@tanstack/react-table'
import { CopyIcon } from 'lucide-react'

export type CellSelectableTable<TFeatures extends TableFeatures, TData extends RowData> = Table<
  TFeatures,
  TData
> &
  Table_CellSelection<TFeatures, TData>

export function CellSelectionController<TFeatures extends TableFeatures, TData extends RowData>({
  table,
}: {
  table: CellSelectableTable<TFeatures, TData>
}) {
  return (
    <div className="relative flex h-full w-full items-center justify-start gap-1 overflow-hidden px-1 text-xs">
      <div className="text-nowrap underline">Selected count: {table.getSelectedCellCount()}</div>
      <div>/</div>
      <div className="truncate underline">
        Selected cells:{' '}
        {toTsv(table.getSelectedCellRangesData()).replaceAll('\t', ', ').replaceAll('\n', '; ')}
      </div>
      <button
        className="absolute right-1 cursor-pointer active:translate-y-0.5"
        onClick={() => navigator.clipboard.writeText(toTsv(table.getSelectedCellRangesData()))}
      >
        <CopyIcon className="h-3 w-3" />
      </button>
    </div>
  )
}

function escapeTsvValue(value: unknown) {
  const text = value == null ? '' : String(value)
  const safeText = typeof value === 'string' && /^[\t\r ]*[=+@-]/.test(value) ? `'${text}` : text
  // spreadsheets expect a quoted field once it contains a delimiter, a newline,
  // or a quote, with inner quotes doubled
  return /["\t\n\r]/.test(safeText) ? `"${safeText.replace(/"/g, '""')}"` : safeText
}

function toTsv(ranges: Array<Array<Array<unknown>>>) {
  return ranges
    .map((grid) => grid.map((row) => row.map(escapeTsvValue).join('\t')).join('\n'))
    .join('\n\n')
}
