import { useEffect } from 'react'

import {
  tableFeatures,
  useTable,
  createColumnHelper,
  columnVisibilityFeature,
} from '@tanstack/react-table'

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
  columnVisibilityFeature,
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

const initialColumnVisibility = {
  color: false,
  red: true,
  green: true,
  blue: true,
  hue: true,
  saturation: true,
  lightness: true,
}

export function Table({ data }: { data: Color[] }) {
  const table = useTable({
    features,
    columns,
    data,
    initialState: {
      columnVisibility: initialColumnVisibility,
    },
  })

  /**
   * Reset to `"columnVisibility": {}`
   */
  const handleResetColumnVisibility = () => {
    table.resetColumnVisibility(true)
  }

  /**
   * Reset to `"columnVisibility": initialColumnVisibility`
   */
  const handleResetInitialColumnVisibility = () => {
    table.resetColumnVisibility()
  }

  const handleHideGreenAndBlue = () => {
    table.setColumnVisibility((prev) => {
      const newVisibility = { ...prev, green: false, blue: false }
      return newVisibility
    })
  }

  useEffect(() => {
    const { unsubscribe } = table.atoms.columnVisibility.subscribe((state) => {
      console.log('Column visibility changed:', state)
    })
    return () => unsubscribe()
  }, [table])

  return (
    <Card title="Column Visibility" description="Column Visibility with useTable and tableFeatures">
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
              <TableRow cells={row.getVisibleCells()}>
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
          <Button onClick={handleResetColumnVisibility}>Reset</Button>
          <Button onClick={handleResetInitialColumnVisibility}>Reset Initial</Button>
          <Button onClick={handleHideGreenAndBlue}>Hide Green and Blue</Button>
        </div>
        <pre className="m-0 overflow-auto p-2 text-xs">{JSON.stringify(table.state, null, 2)}</pre>
      </div>
    </Card>
  )
}
