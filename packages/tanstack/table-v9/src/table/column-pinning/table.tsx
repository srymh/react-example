import { useEffect } from 'react'

import {
  tableFeatures,
  useTable,
  createColumnHelper,
  columnSizingFeature,
  columnPinningFeature,
  columnOrderingFeature,
} from '@tanstack/react-table'
import type {
  TableFeatures,
  RowData,
  CellData,
  Cell,
  Column,
  Column_ColumnPinning,
  Column_ColumnSizing,
  Column_ColumnOrdering,
  Row,
  Row_ColumnPinning,
  Header,
  Table_ColumnPinning,
  Table,
} from '@tanstack/react-table'
import { PinIcon, PinOffIcon } from 'lucide-react'

import { Button } from '../../components/button'
import { Card } from '../../components/card'
import { ColorCell } from '../../components/color-cell'
import {
  Table as TableComponent,
  TableCell,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
  TableHead,
  TableBody,
} from '../../components/table'
import type { Color } from '../../data/color'

const features = tableFeatures({
  columnSizingFeature,
  columnPinningFeature,
  columnOrderingFeature,
})

const columnHelper = createColumnHelper<typeof features, Color>()

const startPinnedColumnShadowClassName =
  'pointer-events-none absolute top-0 -right-3 h-full w-3 bg-[linear-gradient(to_right,rgba(15,23,42,0.16),rgba(15,23,42,0.06),transparent)]'

const endPinnedColumnShadowClassName =
  'pointer-events-none absolute top-0 -left-3 h-full w-3 bg-[linear-gradient(to_left,rgba(15,23,42,0.16),rgba(15,23,42,0.06),transparent)]'

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'color',
    header: 'Color',
    cell: (props) => <ColorCell {...props.row.original} />,
  }),
  columnHelper.accessor('red', { header: 'Red', size: 150 }),
  columnHelper.accessor('green', { header: 'Green' }),
  columnHelper.accessor('blue', { header: 'Blue' }),
  columnHelper.accessor('hue', { header: 'Hue' }),
  columnHelper.accessor('saturation', { header: 'Saturation' }),
  columnHelper.accessor('lightness', { header: 'Lightness' }),
])

export function Table({ data }: { data: Color[] }) {
  const table = useTable({
    features,
    columns,
    data,
    initialState: {
      columnPinning: {
        start: ['color', 'red'],
        end: ['lightness'],
      },
    },
  })

  const handleReset = () => {
    table.resetColumnPinning(true)
  }

  const handleResetInitial = () => {
    table.resetColumnPinning()
  }

  useEffect(() => {
    const { unsubscribe } = table.atoms.columnPinning.subscribe((columnPinning) => {
      console.log('Column pinning changed:', columnPinning)
    })

    return () => unsubscribe()
  }, [table])

  return (
    <Card title="Column Pinning" description="Pin columns to the start or end of the table.">
      <div className="min-w-30 flex-1 overflow-auto">
        <TableComponent
          fullWidth={false}
          style={
            {
              '--table-width': `${table.getTotalSize()}px`,
            } as React.CSSProperties
          }
          className="w-(--table-width) table-fixed"
        >
          <TableHead headerGroups={table.getHeaderGroups()}>
            {(headerGroup) => (
              <TableHeaderRow headers={headerGroup.headers}>
                {(header) => (
                  <TableHeaderCellWithPinning header={header}>
                    <table.FlexRender header={header} />
                  </TableHeaderCellWithPinning>
                )}
              </TableHeaderRow>
            )}
          </TableHead>

          <TableBody rows={table.getRowModel().rows}>
            {(row) => (
              <TableRow
                cells={[
                  ...row.getStartVisibleCells(),
                  ...row.getCenterVisibleCells(),
                  ...row.getEndVisibleCells(),
                ]}
              >
                {(cell) => (
                  <TableCellWithPinning cell={cell}>
                    <table.FlexRender cell={cell} />
                  </TableCellWithPinning>
                )}
              </TableRow>
            )}
          </TableBody>
        </TableComponent>
      </div>

      <div className="flex h-full w-50 shrink-0 flex-col gap-0 border border-slate-400 bg-slate-100">
        <div className="flex flex-wrap items-center justify-center gap-1 border-b border-slate-400 p-1">
          <Button onClick={handleReset}>Reset</Button>
          <Button onClick={handleResetInitial}>Reset Initial</Button>
        </div>
        <pre className="m-0 overflow-auto p-2 text-xs">{JSON.stringify(table.state, null, 2)}</pre>
      </div>
    </Card>
  )
}

type PinnableHeader<TFeatures extends TableFeatures, TData extends RowData> = Header<
  TFeatures,
  TData
> & {
  column: Column<TFeatures, TData> &
    Column_ColumnPinning &
    Column_ColumnSizing &
    Column_ColumnOrdering
  table: Table<TFeatures, TData> & Table_ColumnPinning<TFeatures, TData>
}

type PinnableCell<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Cell<TFeatures, TData, TValue> & {
  column: Column<TFeatures, TData, TValue> &
    Column_ColumnPinning &
    Column_ColumnSizing &
    Column_ColumnOrdering
  row: Row<TFeatures, TData> & Row_ColumnPinning<TFeatures, TData>
}

function TableHeaderCellWithPinning<TFeatures extends TableFeatures, TData extends RowData>({
  children,
  header,
}: {
  children?: React.ReactNode
  header: PinnableHeader<TFeatures, TData>
}) {
  const isPinned = header.column.getIsPinned()
  const isCenterColumn = !isPinned
  const isFirstColumnOfCenter = isCenterColumn && header.column.getIsFirstColumn('center')
  const isLastColumnOfStart = isPinned === 'start' && header.column.getIsLastColumn('start')
  const dataIsLastColumnOfStart = isLastColumnOfStart
    ? { 'data-is-last-column-of-start': true }
    : {}
  const dataIsPinned = isPinned ? { 'data-is-pinned': isPinned } : {}
  const isLastColumnOfCenter = isCenterColumn && header.column.getIsLastColumn('center')
  const hasSomeEndPinnedColumns = header.table.getEndVisibleLeafColumns().length > 0
  const dataIsLastColumnOfCenter =
    isLastColumnOfCenter && hasSomeEndPinnedColumns ? { 'data-is-last-column-of-center': true } : {}
  const isFirstColumnOfEnd = isPinned === 'end' && header.column.getIsFirstColumn('end')
  const dataIsFirstColumnOfEnd = isFirstColumnOfEnd ? { 'data-is-first-column-of-end': true } : {}

  const handlePinToEnd = (columnIds: string[]) => {
    header.table.setColumnPinning((old) => ({
      start: old.start.filter((id) => !columnIds.includes(id)),
      end: [...columnIds, ...old.end.filter((id) => !columnIds.includes(id))],
    }))
  }

  return (
    <TableHeaderCell
      style={
        {
          '--cell-size': `${header.column.getSize()}px`,
          '--inline-start': `${header.column.getStart('start') ?? 0}px`,
          '--inline-end': `${header.column.getAfter('end') ?? 0}px`,
        } as React.CSSProperties
      }
      {...dataIsPinned}
      {...dataIsLastColumnOfStart}
      {...dataIsLastColumnOfCenter}
      {...dataIsFirstColumnOfEnd}
      className='z-30 w-(--cell-size) data-is-pinned:sticky data-is-pinned:bg-gray-100 data-[is-last-column-of-center=true]:border-r-0 data-[is-last-column-of-start=true]:border-r-0 data-[is-pinned="end"]:right-(--inline-end) data-[is-pinned="end"]:z-40 data-[is-pinned="start"]:left-(--inline-start) data-[is-pinned="start"]:z-50'
    >
      <div className="relative flex items-center justify-center gap-1">
        {header.column.getCanPin() && (
          <>
            {isLastColumnOfStart ? (
              <button
                onClick={() => header.column.pin(false)}
                className="group absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer border border-dashed border-gray-400 hover:border-gray-500"
              >
                <PinOffIcon className="h-3 w-3 stroke-gray-400 group-hover:stroke-gray-500" />
              </button>
            ) : isFirstColumnOfCenter ? (
              <button
                onClick={() => header.column.pin('start')}
                className="group absolute top-1/2 left-0 -translate-y-1/2 cursor-pointer border border-dashed border-gray-400 hover:border-gray-500"
              >
                <PinIcon className="h-3 w-3 translate-y-px rotate-45 stroke-gray-400 group-hover:stroke-gray-500" />
              </button>
            ) : null}
          </>
        )}

        {children}

        {header.column.getCanPin() && (
          <>
            {isFirstColumnOfEnd ? (
              <button
                onClick={() => header.column.pin(false)}
                className="group absolute top-1/2 left-0 -translate-y-1/2 cursor-pointer border border-dashed border-gray-400 hover:border-gray-500"
              >
                <PinOffIcon className="h-3 w-3 stroke-gray-400 group-hover:stroke-gray-500" />
              </button>
            ) : isLastColumnOfCenter ? (
              <button
                onClick={() => {
                  handlePinToEnd(
                    header.column
                      .getLeafColumns()
                      .flatMap((column) => (column.id ? [column.id] : [])),
                  )
                }}
                className="group absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer border border-dashed border-gray-400 hover:border-gray-500"
              >
                <PinIcon className="h-3 w-3 translate-y-px -rotate-45 stroke-gray-400 group-hover:stroke-gray-500" />
              </button>
            ) : null}
          </>
        )}
      </div>
      {isLastColumnOfStart && <div aria-hidden className={startPinnedColumnShadowClassName}></div>}
      {isFirstColumnOfEnd && <div aria-hidden className={endPinnedColumnShadowClassName}></div>}
    </TableHeaderCell>
  )
}

function TableCellWithPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>({
  children,
  cell,
}: {
  children?: React.ReactNode
  cell: PinnableCell<TFeatures, TData, TValue>
}) {
  const isPinned = cell.column.getIsPinned()
  const dataIsPinned = isPinned ? { 'data-is-pinned': isPinned } : {}
  const isLastColumnOfCenter = !isPinned && cell.column.getIsLastColumn('center')
  const hasSomeEndPinnedColumns = cell.row.getEndVisibleCells().length > 0
  const dataIsLastColumnOfCenter =
    isLastColumnOfCenter && hasSomeEndPinnedColumns ? { 'data-is-last-column-of-center': true } : {}
  const isFirstColumnOfEnd = isPinned === 'end' && cell.column.getIsFirstColumn('end')
  const dataIsFirstColumnOfEnd = isFirstColumnOfEnd ? { 'data-is-first-column-of-end': true } : {}
  const isLastColumnOfStart = isPinned === 'start' && cell.column.getIsLastColumn('start')
  const dataIsLastColumnOfStart = isLastColumnOfStart
    ? { 'data-is-last-column-of-start': true }
    : {}

  return (
    <TableCell
      style={
        {
          '--cell-size': `${cell.column.getSize()}px`,
          '--inline-start': `${cell.column.getStart('start') ?? 0}px`,
          '--inline-end': `${cell.column.getAfter('end') ?? 0}px`,
        } as React.CSSProperties
      }
      {...dataIsPinned}
      {...dataIsLastColumnOfStart}
      {...dataIsLastColumnOfCenter}
      {...dataIsFirstColumnOfEnd}
      className='relative w-(--cell-size) data-is-pinned:sticky data-is-pinned:bg-white data-[is-last-column-of-center=true]:border-r-0 data-[is-last-column-of-start=true]:border-r-0 data-[is-pinned="end"]:right-(--inline-end) data-[is-pinned="end"]:z-10 data-[is-pinned="start"]:left-(--inline-start) data-[is-pinned="start"]:z-20'
    >
      {children}
      {isLastColumnOfStart && <div aria-hidden className={startPinnedColumnShadowClassName}></div>}
      {isFirstColumnOfEnd && <div aria-hidden className={endPinnedColumnShadowClassName}></div>}
    </TableCell>
  )
}
