import { useEffect, useState } from 'react'

import {
  tableFeatures,
  useTable,
  createColumnHelper,
  columnSizingFeature,
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
  columnSizingFeature,
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

const initialColumnSizing = {
  color: 160,
  red: 80,
  green: 40,
  blue: 20,
}

export function Table({ data }: { data: Color[] }) {
  const [fullWidth, setFullWidth] = useState(false)
  const [tableFixed, setTableFixed] = useState(false)

  const table = useTable({
    features,
    columns,
    data,
    defaultColumn: {
      size: 200, // default column size
    },
    initialState: {
      columnSizing: initialColumnSizing,
    },
  })

  /**
   * Reset to `"columnSizing": {}`
   */
  const handleResetColumnSizing = () => {
    table.resetColumnSizing(true)
  }

  /**
   * Reset to `"columnSizing": initialColumnSizing`
   */
  const handleResetInitialColumnSizing = () => {
    table.resetColumnSizing()
  }

  const handleAdjustColumnSizing = () => {
    table.setColumnSizing({
      color: 20,
      red: 40,
      green: 80,
      blue: 160,
    })
  }

  useEffect(() => {
    const { unsubscribe } = table.atoms.columnSizing.subscribe((state) => {
      console.log('Column sizing changed:', state)
    })
    return () => unsubscribe()
  }, [table])

  return (
    <Card title="Column Sizing" description="Column Sizing with useTable and tableFeatures">
      <div className="min-w-30 flex-1 overflow-auto">
        <WidthAdaptiveTable
          fullWidth={fullWidth}
          tableFixed={tableFixed}
          width={table.getTotalSize()}
        >
          <TableHead headerGroups={table.getHeaderGroups()}>
            {(headerGroup) => (
              <TableHeaderRow headers={headerGroup.headers}>
                {(header) => (
                  <TableHeaderCell
                    className="w-(--header-cell-size) truncate"
                    style={
                      {
                        '--header-cell-size': `${header.getSize()}px`,
                      } as React.CSSProperties
                    }
                  >
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
                  <TableCell
                    className="w-(--header-cell-size) truncate"
                    style={
                      {
                        '--header-cell-size': `${cell.column.getSize()}px`,
                      } as React.CSSProperties
                    }
                  >
                    <table.FlexRender cell={cell} />
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </WidthAdaptiveTable>
      </div>

      <div className="flex h-full w-50 shrink-0 flex-col gap-0 border border-slate-400 bg-slate-100">
        <div className="flex flex-wrap items-center justify-center gap-1 border-b border-slate-400 p-1">
          <Button onClick={() => setFullWidth((prev) => !prev)}>
            {fullWidth ? 'Disable' : 'Enable'} Full Width
          </Button>
          <Button onClick={() => setTableFixed((prev) => !prev)}>
            {tableFixed ? 'Disable' : 'Enable'} Table Fixed
          </Button>
          <Button onClick={handleResetColumnSizing}>Reset</Button>
          <Button onClick={handleResetInitialColumnSizing}>Reset Initial</Button>
          <Button onClick={handleAdjustColumnSizing}>Adjust</Button>
        </div>
        <pre className="m-0 overflow-auto p-2 text-xs">
          table width: {fullWidth ? '100%' : `${table.getTotalSize()}px`}
        </pre>
        <pre className="m-0 overflow-auto p-2 text-xs">
          table fixed: {tableFixed ? 'enabled' : 'disabled'}
        </pre>
        <pre className="m-0 overflow-auto p-2 text-xs">{JSON.stringify(table.state, null, 2)}</pre>
        <pre className="m-0 overflow-auto p-2 text-xs">
          getTotalSize(): {JSON.stringify(table.getTotalSize(), null, 2)}
        </pre>
      </div>
    </Card>
  )
}

function WidthAdaptiveTable({
  children,
  fullWidth,
  tableFixed,
  width,
}: {
  children: React.ReactNode
  fullWidth: boolean
  tableFixed: boolean
  width: number
}) {
  return (
    <TableComponent
      className={`${tableFixed ? 'table-fixed' : ''} ${!fullWidth ? 'w-(--table-width)' : ''}`}
      style={{ '--table-width': `${width}px` } as React.CSSProperties}
      fullWidth={fullWidth}
    >
      {children}
    </TableComponent>
  )
}
