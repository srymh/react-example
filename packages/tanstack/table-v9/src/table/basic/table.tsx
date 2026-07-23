import { tableFeatures, useTable, createColumnHelper } from '@tanstack/react-table'

import { Card } from '../../components/card'
import { ColorCell } from '../../components/color-cell'
import {
  Table as TableComponent,
  TableCell,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
  TableBody,
  TableHead,
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
  columnHelper.accessor('hue', { header: 'Hue' }),
  columnHelper.accessor('saturation', { header: 'Saturation' }),
  columnHelper.accessor('lightness', { header: 'Lightness' }),
])

export function Table({ data }: { data: Color[] }) {
  const table = useTable({
    features,
    columns,
    data,
  })

  return (
    <Card title="Basic Table" description="Basic table with useTable and tableFeatures">
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
    </Card>
  )
}
