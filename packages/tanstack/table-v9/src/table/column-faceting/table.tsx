import { useEffect } from 'react'

import {
  tableFeatures,
  useTable,
  createColumnHelper,
  columnFilteringFeature,
  columnFacetingFeature,
  createFilteredRowModel,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFacetedMinMaxValues,
  filterFn_inNumberRange,
  filterFn_equals,
  metaHelper,
  constructFilterFn,
} from '@tanstack/react-table'
import type { Column, Updater } from '@tanstack/react-table'

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

type MyColumnMeta = {
  filterVariant?: 'number-range' | 'number-equals' | 'number-range-bucket'
}

type RangeBucket = 'under-20' | '[20, 40)' | '[40, 60)' | '[60, 80)' | '[80, 100)' | 'over-100'

function getRangeBucket(value: number): RangeBucket {
  if (value < 20) return 'under-20'
  if (value < 40) return '[20, 40)'
  if (value < 60) return '[40, 60)'
  if (value < 80) return '[60, 80)'
  if (value < 100) return '[80, 100)'
  return 'over-100'
}

const rangeBucketFilter = constructFilterFn({
  resolveDataValue: (value) => getRangeBucket(value as number),
  filter: (dataValue, filterValue) => {
    const result = filterValue === dataValue
    console.log(`dataValue: ${dataValue}, filterValue: ${filterValue}, result: ${result}`)
    return result
  },
  autoRemove: (filterValue) => {
    return filterValue == null
  },
})

const features = tableFeatures({
  columnFilteringFeature,
  columnFacetingFeature,
  filteredRowModel: createFilteredRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
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
    filterFn: rangeBucketFilter,
    meta: {
      filterVariant: 'number-range-bucket',
    },
    getUniqueValues: (row) => [getRangeBucket(row.saturation)],
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
    <Card title="Column Faceting" description="Column faceting with useTable and tableFeatures">
      <div className="min-w-30 flex-1 overflow-auto">
        <TableComponent>
          <TableHead headerGroups={table.getHeaderGroups()}>
            {(headerGroup) => (
              <TableHeaderRow headers={headerGroup.headers}>
                {(header) => (
                  <TableHeaderCell>
                    <div className="flex h-full w-full flex-col items-center justify-center py-0.5">
                      <table.FlexRender header={header} />
                      {header.column.getCanFilter() && <Filter column={header.column} />}
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
      const [min, max] = column.getFacetedMinMaxValues() ?? []
      return (
        <NumberRangeFilterForUnsafeValue
          value={value}
          onChangeValue={handleChangeValue}
          min={min}
          max={max}
        />
      )
    case 'number-equals': {
      const suggestions = Array.from(column.getFacetedUniqueValues().entries()).sort(
        ([a], [b]) => Number(a) - Number(b),
      )

      if (typeof value !== 'number' && value !== undefined) {
        return <div>⚠️想定外の値です</div>
      }

      return (
        <select
          className="w-full border border-slate-400 px-1 py-0 text-xs"
          value={value ?? ''}
          onChange={(e) => handleChangeValue(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">未選択</option>
          {suggestions.map(([facetedValue, count]) => (
            <option key={String(facetedValue)} value={String(facetedValue)}>
              {facetedValue} ({count})
            </option>
          ))}
        </select>
      )
    }
    case 'number-range-bucket': {
      const suggestions = Array.from(column.getFacetedUniqueValues().entries()).sort(([a], [b]) => {
        const order: Record<RangeBucket, number> = {
          'over-100': 0,
          '[80, 100)': 1,
          '[60, 80)': 2,
          '[40, 60)': 3,
          '[20, 40)': 4,
          'under-20': 5,
        }
        return order[a as RangeBucket] - order[b as RangeBucket]
      })

      if (typeof value !== 'string' && value !== undefined) {
        return <div>⚠️想定外の値です</div>
      }

      return (
        <select
          className="w-full border border-slate-400 px-1 py-0 text-xs"
          value={value ?? ''}
          onChange={(e) => handleChangeValue(e.target.value || undefined)}
        >
          <option value="">未選択</option>
          {suggestions.map(([facetedValue, count]) => (
            <option key={String(facetedValue)} value={String(facetedValue)}>
              {facetedValue} ({count})
            </option>
          ))}
        </select>
      )
    }
    default:
      return <></>
  }
}
