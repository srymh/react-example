import type {
  Cell,
  Row,
  Row_RowPinning,
  RowData,
  Table_RowPinning,
  TableFeatures,
} from '@tanstack/react-table'

import { TableRow } from '../../components/table'
import type { PinnedRowOffsets } from './use-pinned-row-offsets'

export type RowPinnableRow<TFeatures extends TableFeatures, TData extends RowData> = Row<
  TFeatures,
  TData
> &
  Row_RowPinning & {
    table: Table_RowPinning<TFeatures, TData>
  }

export function TableRowWithRowPinning<TFeatures extends TableFeatures, TData extends RowData>({
  children,
  row,
  pinnedRowOffsets,
  setPinnedRowRef,
}: {
  children: (cell: Cell<TFeatures, TData>) => React.ReactNode
  row: RowPinnableRow<TFeatures, TData>
  pinnedRowOffsets: PinnedRowOffsets
  setPinnedRowRef: (rowId: string, node: HTMLTableRowElement | null) => void
}) {
  const isPinned = row.getIsPinned()
  const dataIsPinned = isPinned ? { 'data-is-pinned': isPinned } : {}

  const pinnedIndex = row.getPinnedIndex()
  const pinnedTop = isPinned === 'top' ? pinnedRowOffsets.top[row.id] : undefined
  const pinnedBottom = isPinned === 'bottom' ? pinnedRowOffsets.bottom[row.id] : undefined

  const style = {
    '--pinned-top': typeof pinnedTop === 'number' ? `${pinnedTop}px` : undefined,
    '--pinned-bottom': typeof pinnedBottom === 'number' ? `${pinnedBottom}px` : undefined,
  } as React.CSSProperties

  // TOPにピン留めされた行の内の最後の行かどうか
  const isLastRowOfTop = isPinned === 'top' && pinnedIndex === row.table.getTopRows().length - 1
  const dataIsLastRowOfTop = isLastRowOfTop ? { 'data-is-last-row-of-top': true } : {}

  // BOTTOMにピン留めされた行の内の最初の行かどうか
  const isFirstRowOfBottom = isPinned === 'bottom' && pinnedIndex === 0
  const dataIsFirstRowOfBottom = isFirstRowOfBottom ? { 'data-is-first-row-of-bottom': true } : {}

  // ピン留めされていない行の内の最初の行かどうか
  const isFirstRowOfCenter = row.table.getCenterRows()[0]?.id === row.id
  const dataIsFirstRowOfCenter = isFirstRowOfCenter ? { 'data-is-first-row-of-center': true } : {}

  // ピン留めされていない行の内の最後の行かどうか
  const isLastRowOfCenter =
    row.table.getCenterRows()[row.table.getCenterRows().length - 1]?.id === row.id
  const dataIsLastRowOfCenter = isLastRowOfCenter ? { 'data-is-last-row-of-center': true } : {}

  // TOPにピン留めされた行の最後の行の下側に影をつけるためのクラス名
  const topPinnedRowsShadowClassName =
    ' data-is-last-row-of-top:[&>td]:border-b-0 data-is-last-row-of-top:after:pointer-events-none data-is-last-row-of-top:after:absolute data-is-last-row-of-top:after:-bottom-3 data-is-last-row-of-top:after:left-0 data-is-last-row-of-top:after:h-3 data-is-last-row-of-top:after:w-full data-is-last-row-of-top:after:bg-[linear-gradient(to_bottom,rgba(15,23,42,0.16),rgba(15,23,42,0.06),transparent)]'

  // BOTTOMにピン留めされた行の最初の行の上側に影をつけるためのクラス名
  const bottomPinnedRowShadowClassName =
    ' data-is-first-row-of-bottom:after:pointer-events-none data-is-first-row-of-bottom:after:absolute data-is-first-row-of-bottom:after:-top-3 data-is-first-row-of-bottom:after:left-0 data-is-first-row-of-bottom:after:h-3 data-is-first-row-of-bottom:after:w-full data-is-first-row-of-bottom:after:bg-[linear-gradient(to_top,rgba(15,23,42,0.16),rgba(15,23,42,0.06),transparent)]'

  return (
    <TableRow
      ref={isPinned ? (node) => setPinnedRowRef(row.id, node) : undefined}
      cells={row.getAllCells()}
      {...dataIsPinned}
      {...dataIsLastRowOfTop}
      {...dataIsFirstRowOfCenter}
      {...dataIsLastRowOfCenter}
      {...dataIsFirstRowOfBottom}
      style={style}
      className={
        'data-is-pinned:sticky data-is-pinned:bg-white data-[is-pinned="bottom"]:bottom-(--pinned-bottom) data-[is-pinned="bottom"]:z-10 data-[is-pinned="top"]:top-(--pinned-top) data-[is-pinned="top"]:z-10 data-is-last-row-of-center:[&>td]:border-b-0' +
        topPinnedRowsShadowClassName +
        bottomPinnedRowShadowClassName
      }
    >
      {(cell) => children(cell)}
    </TableRow>
  )
}
