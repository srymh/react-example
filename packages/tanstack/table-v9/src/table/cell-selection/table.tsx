import { useEffect } from 'react'

import {
  tableFeatures,
  useTable,
  createColumnHelper,
  cellSelectionFeature,
} from '@tanstack/react-table'
import type {
  Cell,
  CellData,
  RowData,
  Cell_CellSelection,
  TableFeatures,
} from '@tanstack/react-table'
import { CopyIcon } from 'lucide-react'

import { Button } from '../../components/button'
import { Card } from '../../components/card'
import { ColorCell } from '../../components/color-cell'
import {
  Table as TableComponent,
  TableCell,
  TableHeaderCell,
  TableHeaderRow,
  TableHead,
  TableBody,
  TableRow,
} from '../../components/table'
import type { Color } from '../../data/color'

const features = tableFeatures({
  cellSelectionFeature,
})

const columnHelper = createColumnHelper<typeof features, Color>()

const rgbToHex = (r: number, g: number, b: number) =>
  `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`

const columns = columnHelper.columns([
  columnHelper.accessor(({ red, green, blue }) => rgbToHex(red, green, blue), {
    id: 'color',
    header: 'Color',
    cell: (props) => <ColorCell {...props.row.original} />,
  }),
  columnHelper.accessor('red', { header: 'Red' }),
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
      cellSelection: [
        {
          anchorRowId: '1',
          anchorColumnId: 'green',
          focusRowId: '4',
          focusColumnId: 'blue',
        },
      ],
    },
  })

  const handleReset = () => {
    table.resetCellSelection(true)
  }

  const handleResetInitial = () => {
    table.resetCellSelection()
  }

  useEffect(() => {
    const { unsubscribe } = table.atoms.cellSelection.subscribe((cellSelection) => {
      console.log('Cell selection changed:', cellSelection)
    })

    return () => unsubscribe()
  }, [table])

  return (
    <Card
      title="Cell Selection"
      description="Cell selection allows you to select cells in the table."
    >
      <div className="min-w-30 flex-1 overflow-auto">
        <TableComponent
          renderBottomController={
            <div className="relative flex h-full w-full items-center justify-start gap-1 overflow-hidden px-1 text-xs">
              <div className="text-nowrap underline">
                Selected count: {table.getSelectedCellCount()}
              </div>
              <div>/</div>
              <div className="truncate underline">
                Selected cells:{' '}
                {toTsv(table.getSelectedCellRangesData())
                  .replaceAll('\t', ', ')
                  .replaceAll('\n', '; ')}
              </div>
              <button
                className="absolute right-1 cursor-pointer active:translate-y-0.5"
                onClick={() =>
                  navigator.clipboard.writeText(toTsv(table.getSelectedCellRangesData()))
                }
              >
                <CopyIcon className="h-3 w-3" />
              </button>
            </div>
          }
        >
          <TableHead headerGroups={table.getHeaderGroups()}>
            {(headerGroup) => (
              <TableHeaderRow headers={headerGroup.headers}>
                {(header) => (
                  <TableHeaderCell className="z-20">
                    <table.FlexRender header={header} />
                  </TableHeaderCell>
                )}
              </TableHeaderRow>
            )}
          </TableHead>

          <TableBody rows={table.getRowModel().rows}>
            {(row) => (
              <TableRow cells={row.getAllCells()}>
                {(cell) => (
                  <TableCellWithSelection cell={cell}>
                    <table.FlexRender cell={cell} />
                  </TableCellWithSelection>
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

type CellSelectableCell<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Cell<TFeatures, TData, TValue> & Cell_CellSelection

function TableCellWithSelection<
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
