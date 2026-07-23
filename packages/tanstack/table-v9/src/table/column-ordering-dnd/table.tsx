import { useEffect } from 'react'

import { RestrictToHorizontalAxis } from '@dnd-kit/abstract/modifiers'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable, useSortable } from '@dnd-kit/react/sortable'
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
  columnHelper.accessor('hue', { header: 'Hue' }),
  columnHelper.accessor('saturation', { header: 'Saturation' }),
  columnHelper.accessor('lightness', { header: 'Lightness' }),
])

const initialColumnOrder = ['red', 'green', 'blue', 'hue', 'saturation', 'lightness', 'color']

function SortableTableHeaderCell({
  children,
  columnId,
  index,
}: {
  children: React.ReactNode
  columnId: string
  index: number
}) {
  const { ref, handleRef } = useSortable({
    id: columnId,
    index,
    modifiers: [RestrictToHorizontalAxis],
  })
  return (
    <TableHeaderCell ref={ref} className="relative">
      {children}
      <button
        type="button"
        className="absolute top-0 right-0 left-0 h-2 w-full cursor-grab bg-black/20 hover:bg-black/40 active:cursor-grabbing"
        ref={handleRef}
      ></button>
    </TableHeaderCell>
  )
}

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
    <Card
      title="Column Ordering with Drag and Drop"
      description="Column ordering with useTable and tableFeatures"
    >
      <div className="min-w-30 flex-1 overflow-auto">
        <TableComponent>
          <DragDropProvider
            onDragEnd={(event) => {
              if (event.canceled) {
                return
              }

              const { source } = event.operation

              if (!isSortable(source)) {
                return
              }

              const { initialIndex, index } = source

              if (initialIndex === index) {
                return
              }

              table.setColumnOrder((prev) => {
                const newOrder = [...prev]
                const [movedColumn] = newOrder.splice(initialIndex, 1)

                if (movedColumn == null) {
                  return prev
                }

                newOrder.splice(index, 0, movedColumn)

                return newOrder
              })
            }}
          >
            <TableHead headerGroups={table.getHeaderGroups()}>
              {(headerGroup) => (
                <TableHeaderRow headers={headerGroup.headers}>
                  {(header, index) => (
                    <SortableTableHeaderCell columnId={header.column.id} index={index}>
                      <table.FlexRender header={header} />
                    </SortableTableHeaderCell>
                  )}
                </TableHeaderRow>
              )}
            </TableHead>
          </DragDropProvider>

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
