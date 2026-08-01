import type {
  Cell,
  CellData,
  RowData,
  Cell_CellSelection,
  TableFeatures,
} from '@tanstack/react-table'

import { TableCell } from '../../components/table'

export type CellSelectableCell<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Cell<TFeatures, TData, TValue> & Cell_CellSelection

export function TableCellWithSelection<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>({
  children,
  cell,
}: {
  children: React.ReactNode
  cell: CellSelectableCell<TFeatures, TData, TValue>
}) {
  const canSelect = cell.getCanSelect()
  const isSelected = cell.getIsSelected()
  const dataIsSelected = isSelected ? { 'data-is-selected': true } : undefined
  const isFocused = cell.getIsFocused()
  const dataIsFocused = isFocused ? { 'data-is-focused': true } : undefined
  const dataSelectedState = isFocused
    ? { 'data-selected-state': 'focused' }
    : isSelected
      ? { 'data-selected-state': 'selected' }
      : undefined
  const selectionEdges = cell.getSelectionEdges()

  const style = {
    '--cell-edge-top': selectionEdges.top
      ? '0 2px 0 0 var(--color-blue-600)'
      : '0 0 0 0 transparent',
    '--cell-edge-right': selectionEdges.right
      ? '-2px 0 0 0 var(--color-blue-600)'
      : '0 0 0 0 transparent',
    '--cell-edge-bottom': selectionEdges.bottom
      ? '0 -2px 0 0 var(--color-blue-600)'
      : '0 0 0 0 transparent',
    '--cell-edge-left': selectionEdges.left
      ? '2px 0 0 0 var(--color-blue-600)'
      : '0 0 0 0 transparent',
  } as React.CSSProperties

  return (
    <TableCell
      {...dataIsSelected}
      {...dataIsFocused}
      {...dataSelectedState}
      style={style}
      className="relative [box-shadow:inset_var(--cell-edge-top),inset_var(--cell-edge-right),inset_var(--cell-edge-bottom),inset_var(--cell-edge-left)] select-none data-[selected-state=focused]:bg-blue-200 data-[selected-state=selected]:bg-blue-50"
      onMouseDown={canSelect ? cell.getSelectionStartHandler() : undefined}
      onMouseEnter={canSelect ? cell.getSelectionExtendHandler() : undefined}
    >
      {children}
    </TableCell>
  )
}
