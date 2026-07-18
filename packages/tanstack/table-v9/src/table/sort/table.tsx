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
  TableHeader,
  TableHeaderRow,
  TableRow,
  TableHeaderSortIcon,
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
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableHeaderRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHeader key={header.id} isPlaceholder={header.isPlaceholder}>
                    <div onClick={header.column.getToggleSortingHandler()}>
                      <table.FlexRender header={header} />
                      <TableHeaderSortIcon isSorted={header.column.getIsSorted()} />
                    </div>
                  </TableHeader>
                ))}
              </TableHeaderRow>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </tbody>
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
