import { useEffect } from 'react'

import {
  tableFeatures,
  useTable,
  createColumnHelper,
  columnFilteringFeature,
  createFilteredRowModel,
  filterFn_inNumberRange,
  filterFn_equals,
  metaHelper,
} from '@tanstack/react-table'
import type { Column, Updater } from '@tanstack/react-table'

import { Button } from '../../components/button'
import { Card } from '../../components/card'
import { ColorCell } from '../../components/color-cell'
import {
  NumberEqualsFilterForUnsafeValue,
  NumberRangeFilterForUnsafeValue,
} from '../../components/filter'
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

type MyColumnMeta = {
  filterVariant?: 'number-range' | 'number-equals'
}

const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: {
    inNumberRange: filterFn_inNumberRange,
    equals: filterFn_equals,
  },
  columnMeta: metaHelper<MyColumnMeta>(),
})

const columnHelper = createColumnHelper<typeof features, Color>()

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'color',
    header: 'Color',
    cell: (props) => <ColorCell {...props.row.original} />,
  }),
  columnHelper.accessor('red', {
    header: 'Red',
    filterFn: 'inNumberRange',
    meta: {
      // Filter コンポーネントで filterFn に合わせたコンポーネントに分岐するために利用する
      filterVariant: 'number-range',
    },
  }),
  columnHelper.accessor('green', {
    header: 'Green',
    filterFn: 'equals',
    meta: {
      filterVariant: 'number-equals',
    },
  }),
  columnHelper.accessor('blue', {
    header: 'Blue',
    // filterFn に auto を指定した場合または、何も指定しない場合には自動的に inNumberRange が使用される。
    filterFn: 'auto',
    meta: {
      filterVariant: 'number-range',
    },
  }),
  columnHelper.accessor('hue', {
    header: 'Hue',
    // filterFn に auto を指定した場合または、何も指定しない場合には自動的に inNumberRange が使用される。
    meta: {
      filterVariant: 'number-range',
    },
  }),
  columnHelper.accessor('saturation', {
    header: 'Saturation',
    filterFn: 'inNumberRange',
    meta: {
      filterVariant: 'number-range',
    },
  }),
  columnHelper.accessor('lightness', {
    header: 'Lightness',
    filterFn: 'inNumberRange',
    meta: {
      filterVariant: 'number-range',
    },
  }),
])

export function Table({ data }: { data: Color[] }) {
  const table = useTable({
    features,
    columns,
    data,
    initialState: {
      columnFilters: [{ id: 'red', value: [100, 150] }],
    },
  })

  /**
   * Reset to `"columnFilters": {}`
   */
  const handleResetColumnFilters = () => {
    table.resetColumnFilters(true)
  }

  /**
   * Reset to `"columnFilters": initialState.columnFilters`
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
      newFilters.push({ id: 'green', value: 50 })
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
    <Card
      title="Column Filtering With Meta"
      description="Column filtering with useTable and tableFeatures"
    >
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
  const filterVariant = column.columnDef.meta?.filterVariant
  const value = column.getFilterValue()
  const handleChangeValue = (updater: Updater<unknown>) => {
    column.setFilterValue(updater)
  }

  switch (filterVariant) {
    case 'number-range':
      return <NumberRangeFilterForUnsafeValue value={value} onChangeValue={handleChangeValue} />
    case 'number-equals':
      return <NumberEqualsFilterForUnsafeValue value={value} onChangeValue={handleChangeValue} />
    default:
      return <></>
  }
}
