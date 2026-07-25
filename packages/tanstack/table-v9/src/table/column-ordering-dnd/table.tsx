import { useEffect } from 'react'

import { RestrictToHorizontalAxis } from '@dnd-kit/abstract/modifiers'
import { Feedback } from '@dnd-kit/dom'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable, useSortable } from '@dnd-kit/react/sortable'
import {
  tableFeatures,
  useTable,
  createColumnHelper,
  columnOrderingFeature,
} from '@tanstack/react-table'
import { MoveLeftIcon, GripHorizontalIcon } from 'lucide-react'

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

type DragDropProviderProps = React.ComponentProps<typeof DragDropProvider>

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

export function Table({ data }: { data: Color[] }) {
  const table = useTable({
    features,
    columns,
    data,
    initialState: {
      columnOrder: ['red', 'green', 'blue', 'hue', 'saturation', 'lightness', 'color'],
    },
  })

  const handleResetColumnOrder = () => {
    table.resetColumnOrder(true)
  }

  const handleResetInitialColumnOrder = () => {
    table.resetColumnOrder()
  }

  // `table.resetColumnOrder(true)` の実行直後のように、`table.state.columnOrder` は空になっていたり、
  // また、すべてのカラムが含まれているとは限らないため、表示中のカラム順を取得するにはこの関数を使用する
  const getDisplayingColumnOrder = () => {
    return table.getAllLeafColumns().map((column) => column.id)
  }

  const handleShiftColumnOrder = () => {
    table.setColumnOrder((prev) => {
      const displayingColumnOrder = getDisplayingColumnOrder()
      const newOrder =
        prev.length === displayingColumnOrder.length ? [...prev] : displayingColumnOrder
      const first = newOrder.shift()
      if (first) {
        newOrder.push(first)
        return newOrder
      } else {
        return prev
      }
    })
  }

  useEffect(() => {
    const { unsubscribe } = table.atoms.columnOrder.subscribe((state) => {
      console.log('Column order changed:', state)
    })
    return () => unsubscribe()
  }, [table])

  const handleDragEnd: DragDropProviderProps['onDragEnd'] = (event) => {
    if (event.canceled) {
      return
    }

    const { source, target } = event.operation

    if (!isSortable(source) || !isSortable(target)) {
      return
    }

    const { index: sourceIndex } = source
    const { index: targetIndex } = target

    if (sourceIndex === targetIndex) {
      return
    }

    table.setColumnOrder((prev) => {
      const displayingColumnOrder = getDisplayingColumnOrder()
      const newOrder =
        prev.length === displayingColumnOrder.length ? [...prev] : displayingColumnOrder
      const [movedColumn] = newOrder.splice(sourceIndex, 1)

      if (movedColumn == null) {
        return prev
      }

      newOrder.splice(targetIndex, 0, movedColumn)

      return newOrder
    })
  }

  return (
    <Card
      title="Column Ordering with Drag and Drop"
      description="Column ordering with useTable and tableFeatures"
    >
      <div className="min-w-30 flex-1 overflow-auto">
        <TableComponent>
          <DragDropProvider onDragEnd={handleDragEnd}>
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
          <Button onClick={handleResetColumnOrder}>Reset</Button>
          <Button onClick={handleResetInitialColumnOrder}>Reset Initial</Button>
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
    plugins: [Feedback.configure({ feedback: 'clone' })],
  })
  return (
    <TableHeaderCell
      ref={ref}
      className="group relative data-[dnd-dragging=true]:border-l data-[dnd-dragging=true]:bg-white/70 data-[dnd-placeholder=clone]:opacity-50"
    >
      <button
        type="button"
        className="absolute top-0 right-0 left-0 hidden h-2 w-full cursor-grab items-center justify-center group-hover:flex hover:bg-black/20 active:cursor-grabbing"
        ref={handleRef}
      >
        <GripHorizontalIcon className="h-2 w-2 text-black/40" />
      </button>
      {children}
    </TableHeaderCell>
  )
}
