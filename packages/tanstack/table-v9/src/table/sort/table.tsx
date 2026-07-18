import {
  tableFeatures,
  useTable,
  createColumnHelper,
  sortFns,
  rowSortingFeature,
  createSortedRowModel,
} from '@tanstack/react-table'

import { Card } from '../../components/card'
import { ColorCell } from '../../components/color-cell'
import {
  Table as TableComponent,
  TableCell,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
  TableHeaderSortIcon,
  TableHead,
  TableBody,
} from '../../components/table'
import type { Color } from '../../data/color'

const features = tableFeatures({
  rowSortingFeature, // enables sorting APIs and state
  sortedRowModel: createSortedRowModel(), // client-side sorting
  sortFns,
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

export function Table({ data }: { data: Color[] }) {
  const table = useTable({
    features,
    columns,
    data,
    initialState: {
      sorting: [{ id: 'red', desc: true }],
    },
  })

  return (
    <Card>
      <div className="flex-1">
        <TableComponent>
          <TableHead headerGroups={table.getHeaderGroups()}>
            {(headerGroup) => (
              <TableHeaderRow headers={headerGroup.headers}>
                {(header) => (
                  <TableHeaderCell>
                    <div onClick={header.column.getToggleSortingHandler()}>
                      <table.FlexRender header={header} />
                      <TableHeaderSortIcon isSorted={header.column.getIsSorted()} />
                    </div>
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

      <div className="h-full w-40 shrink-0 border border-slate-400 bg-slate-100">
        <pre className="m-0 h-full overflow-auto p-2 text-xs">
          {JSON.stringify(table.state, null, 2)}
        </pre>
      </div>
    </Card>
  )
}
