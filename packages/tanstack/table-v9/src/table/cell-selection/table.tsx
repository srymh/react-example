import { useEffect } from 'react'

import {
  tableFeatures,
  useTable,
  createColumnHelper,
  cellSelectionFeature,
} from '@tanstack/react-table'

import { Button } from '../../components/button'
import { Card } from '../../components/card'
import { ColorCell } from '../../components/color-cell'
import {
  Table as TableComponent,
  TableHeaderCell,
  TableHeaderRow,
  TableHead,
  TableBody,
  TableRow,
} from '../../components/table'
import { rgbToHex } from '../../data/color'
import type { Color } from '../../data/color'
import { CellSelectionController } from './cell-selection-controller'
import { TableCellWithSelection } from './table-cell-with-cell-selection'

const features = tableFeatures({
  cellSelectionFeature,
})

const columnHelper = createColumnHelper<typeof features, Color>()

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
        <TableComponent renderBottomController={<CellSelectionController table={table} />}>
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
