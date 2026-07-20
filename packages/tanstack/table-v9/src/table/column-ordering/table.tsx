import { useEffect } from 'react'

import {
  tableFeatures,
  useTable,
  createColumnHelper,
  columnOrderingFeature,
} from '@tanstack/react-table'
import { MoveLeftIcon } from 'lucide-react'

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
  columnOrderingFeature,
})

const columnHelper = createColumnHelper<typeof features, Color>()

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'color',
    header: 'Color',
    cell: (props) => <ColorCell {...props.row.original} />,
  }),
  columnHelper.accessor('red', { header: 'Red' }),
  columnHelper.accessor('green', { header: 'Green' }),
  columnHelper.accessor('blue', { header: 'Blue' }),
])

const initialColumnOrder = ['red', 'green', 'blue', 'color']

export function Table({ data }: { data: Color[] }) {
  const table = useTable({
    features,
    columns,
    data,
    initialState: {
      columnOrder: initialColumnOrder,
    },
  })

  const handleResetColumnOrder = () => {
    table.resetColumnOrder()
  }

  const handleShiftColumnOrder = () => {
    table.setColumnOrder((prev) => {
      const newOrder = [...prev]
      const first = newOrder.shift()
      newOrder.push(first!)
      return newOrder
    })
  }

  useEffect(() => {
    const { unsubscribe } = table.atoms.columnOrder.subscribe((state) => {
      console.log('Column order changed:', state)
    })
    return () => unsubscribe()
  }, [table])

  return (
    <Card title="Column Ordering" description="Column Ordering with useTable and tableFeatures">
      <div className="min-w-30 flex-1 overflow-auto">
        <TableComponent>
          <TableHead headerGroups={table.getHeaderGroups()}>
            {(headerGroup) => (
              <TableHeaderRow headers={headerGroup.headers}>
                {(header) => (
                  <TableHeaderCell>
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
                  <TableCell>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </TableComponent>
      </div>

      <div className="flex h-full w-50 shrink-0 flex-col gap-0 border border-slate-400 bg-slate-100">
        <div className="flex flex-wrap items-center justify-center gap-1 border-b border-slate-400 p-1">
          <Button onClick={handleResetColumnOrder}>Reset Column Order</Button>
          <Button onClick={handleShiftColumnOrder}>
            <span className="flex items-center">
              Shift Column Order
              <MoveLeftIcon className="ml-1 h-3 w-3" />
            </span>
          </Button>
        </div>
        <pre className="m-0 overflow-auto p-2 text-xs">{JSON.stringify(table.state, null, 2)}</pre>
      </div>
    </Card>
  )
}
