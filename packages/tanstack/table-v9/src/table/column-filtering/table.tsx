import { useEffect } from 'react'

import {
  tableFeatures,
  useTable,
  createColumnHelper,
  columnFilteringFeature,
  createFilteredRowModel,
  filterFn_inNumberRange,
} from '@tanstack/react-table'
import type { Column, ColumnFiltersState, Updater } from '@tanstack/react-table'

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
  columnFilteringFeature,
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
  columnHelper.accessor('red', { header: 'Red', filterFn: 'inNumberRange' }),
  columnHelper.accessor('green', { header: 'Green', filterFn: 'inNumberRange' }),
  columnHelper.accessor('blue', { header: 'Blue', filterFn: 'inNumberRange' }),
])

const initialColumnFilters: ColumnFiltersState = [
  {
    id: 'red',
    value: [100, 150],
  },
]

export function Table({ data }: { data: Color[] }) {
  const table = useTable({
    features,
    columns,
    data,
    initialState: {
      columnFilters: initialColumnFilters,
    },
  })

  /**
   * Reset to `"columnFilters": {}`
   */
  const handleResetColumnFilters = () => {
    table.resetColumnFilters(true)
  }

  /**
   * Reset to `"columnFilters": initialColumnFilters`
   */
  const handleResetInitialColumnFilters = () => {
    table.resetColumnFilters()
  }

  const handleFilterGreen = () => {
    table.setColumnFilters((prev) => {
      const newFilters = [...prev]
      const greenFilterIndex = newFilters.findIndex((f) => f.id === 'green')
      if (greenFilterIndex !== -1) {
        newFilters.splice(greenFilterIndex, 1)
      }
      newFilters.push({ id: 'green', value: [100, 150] })
      return newFilters
    })
  }

  useEffect(() => {
    const { unsubscribe } = table.atoms.columnFilters.subscribe((state) => {
      console.log('Column filters changed:', state)
    })
    return () => unsubscribe()
  }, [table])

  return (
    <Card title="Column Filtering" description="Column filtering with useTable and tableFeatures">
      <div className="min-w-30 flex-1 overflow-auto">
        <TableComponent>
          <TableHead headerGroups={table.getHeaderGroups()}>
            {(headerGroup) => (
              <TableHeaderRow headers={headerGroup.headers}>
                {(header) => (
                  <TableHeaderCell>
                    <table.FlexRender header={header} />
                    {header.column.getCanFilter() && <Filter column={header.column} />}
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
          <Button onClick={handleResetColumnFilters}>Reset</Button>
          <Button onClick={handleResetInitialColumnFilters}>Reset Initial</Button>
          <Button onClick={handleFilterGreen}>Filter Green</Button>
        </div>
        <pre className="m-0 overflow-auto p-2 text-xs">{JSON.stringify(table.state, null, 2)}</pre>
      </div>
    </Card>
  )
}

function Filter({ column }: { column: Column<typeof features, Color, unknown> }) {
  return (
    <NumberRangeFilter
      filterValue={column.getFilterValue() as [number, number] | undefined}
      setFilterValue={column.setFilterValue.bind(column)}
    />
  )
}

function NumberRangeFilter({
  filterValue,
  setFilterValue,
}: {
  filterValue: [number | undefined, number | undefined] | undefined
  setFilterValue: (updater: Updater<[number | undefined, number | undefined] | undefined>) => void
}) {
  const min = filterValue?.[0] ?? ''
  const max = filterValue?.[1] ?? ''

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-1 pb-1">
      <input
        type="number"
        placeholder="min"
        value={min}
        onChange={(e) =>
          setFilterValue((old) => [e.target.value ? Number(e.target.value) : undefined, old?.[1]])
        }
        className="w-16 border border-slate-400 px-1 py-0 text-xs"
      />
      <input
        type="number"
        placeholder="max"
        value={max}
        onChange={(e) =>
          setFilterValue((old) => [old?.[0], e.target.value ? Number(e.target.value) : undefined])
        }
        className="w-16 border border-slate-400 px-1 py-0 text-xs"
      />
    </div>
  )
}
