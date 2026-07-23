import { useEffect } from 'react'

import {
  tableFeatures,
  useTable,
  createColumnHelper,
  columnFilteringFeature,
  globalFilteringFeature,
  createFilteredRowModel,
  filterFn_inNumberRange,
} from '@tanstack/react-table'

import { Button } from '../../components/button'
import { Card } from '../../components/card'
import { ColorCell } from '../../components/color-cell'
import { NumberRangeFilterForUnsafeValue } from '../../components/filter'
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
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: {
    inNumberRange: filterFn_inNumberRange,
  },
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
      globalFilter: [200, 255],
    },
    globalFilterFn: 'inNumberRange',
  })

  /**
   * Reset to `"globalFilter": {}`
   */
  const handleResetGlobalFilter = () => {
    table.resetGlobalFilter(true)
  }

  /**
   * Reset to `"globalFilter": initialState.globalFilter`
   */
  const handleResetInitialGlobalFilter = () => {
    table.resetGlobalFilter()
  }

  useEffect(() => {
    const { unsubscribe } = table.atoms.globalFilter.subscribe((state) => {
      console.log('Global filter changed:', state)
    })
    return () => unsubscribe()
  }, [table])

  return (
    <Card title="Global Filtering" description="Global filtering with useTable and tableFeatures">
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
          <Button onClick={handleResetGlobalFilter}>Reset</Button>
          <Button onClick={handleResetInitialGlobalFilter}>Reset Initial</Button>
          <NumberRangeFilterForUnsafeValue
            value={table.state.globalFilter}
            onChangeValue={(value: any) => {
              table.setGlobalFilter(value)
            }}
          />
        </div>
        <pre className="m-0 overflow-auto p-2 text-xs">{JSON.stringify(table.state, null, 2)}</pre>
      </div>
    </Card>
  )
}
