import { tableFeatures, useTable, createColumnHelper } from '@tanstack/react-table'

import { Card } from '../../components/card'
import { ColorCell } from '../../components/color-cell'
import {
  Table as TableComponent,
  TableCell,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from '../../components/table'
import type { Color } from '../../data/color'

const features = tableFeatures({})

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
  })

  return (
    <Card>
      <TableComponent>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableHeaderRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHeader key={header.id} isPlaceholder={header.isPlaceholder}>
                  <table.FlexRender header={header} />
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
    </Card>
  )
}
