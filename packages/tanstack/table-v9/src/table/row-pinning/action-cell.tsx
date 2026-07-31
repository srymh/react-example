import type { Row_RowPinning, TableFeatures, RowData, Row } from '@tanstack/react-table'
import { PinIcon, PinOffIcon } from 'lucide-react'

export type RowPinnableRow<TFeatures extends TableFeatures, TData extends RowData> = Row<
  TFeatures,
  TData
> &
  Row_RowPinning

export function ActionCell<TFeatures extends TableFeatures, TData extends RowData>({
  row,
}: {
  row: RowPinnableRow<TFeatures, TData>
}) {
  return (
    <div className="flex h-full w-full items-center justify-center gap-1">
      <button
        onClick={() => {
          if (row.getIsPinned() === 'top') {
            row.pin(false)
          } else {
            row.pin('top')
          }
        }}
        className="group cursor-pointer border border-dashed border-gray-400 hover:border-gray-500"
      >
        {row.getIsPinned() === 'top' ? (
          <PinOffIcon className="h-3 w-3 rotate-180 stroke-gray-400 group-hover:stroke-gray-500" />
        ) : (
          <PinIcon className="h-3 w-3 rotate-180 stroke-gray-400 group-hover:stroke-gray-500" />
        )}
      </button>
      <button
        onClick={() => {
          if (row.getIsPinned() === 'bottom') {
            row.pin(false)
          } else {
            row.pin('bottom')
          }
        }}
        className="group cursor-pointer border border-dashed border-gray-400 hover:border-gray-500"
      >
        {row.getIsPinned() === 'bottom' ? (
          <PinOffIcon className="h-3 w-3 stroke-gray-400 group-hover:stroke-gray-500" />
        ) : (
          <PinIcon className="h-3 w-3 stroke-gray-400 group-hover:stroke-gray-500" />
        )}
      </button>
    </div>
  )
}
