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
  const value = column.getFilterValue() as [number, number] | undefined
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

function NumberRangeFilterForUnsafeValue({
  value,
  onChangeValue,
}: {
  value: unknown
  onChangeValue: (updater: Updater<unknown>) => void
}) {
  const val = value as [number, number] | undefined
  const min = val?.[0]
  const max = val?.[1]

  const handleChangeMin = (newMin: number | undefined) => {
    onChangeValue((old: [number, number] | undefined) => {
      const newMax = old?.[1]
      if (newMin !== undefined || newMax !== undefined) {
        return [newMin, newMax]
      } else {
        return undefined
      }
    })
  }

  const handleChangeMax = (newMax: number | undefined) => {
    onChangeValue((old: [number, number] | undefined) => {
      const newMin = old?.[0]
      if (newMin !== undefined || newMax !== undefined) {
        return [newMin, newMax]
      } else {
        return undefined
      }
    })
  }

  return (
    <NumberRangeFilter
      min={min}
      max={max}
      onChangeMin={handleChangeMin}
      onChangeMax={handleChangeMax}
    />
  )
}

function NumberRangeFilter({
  min,
  max,
  onChangeMin,
  onChangeMax,
}: {
  min: number | undefined
  max: number | undefined
  onChangeMin: (value: number | undefined) => void
  onChangeMax: (value: number | undefined) => void
}) {
  const minValue = min ?? ''
  const maxValue = max ?? ''

  const handleChangeMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = e.target.value ? Number(e.target.value) : undefined
    onChangeMin(newMin)
  }

  const handleChangeMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = e.target.value ? Number(e.target.value) : undefined
    onChangeMax(newMax)
  }

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-1 pb-1">
      <input
        type="number"
        placeholder="min"
        // value に undefined を入力してしまうと、
        // Controlled コンポーネントとして動作しなくなるため、空文字として入力する
        // https://react.dev/link/controlled-components
        value={minValue}
        onChange={handleChangeMin}
        className="w-16 border border-slate-400 px-1 py-0 text-xs"
      />
      <input
        type="number"
        placeholder="max"
        value={maxValue}
        onChange={handleChangeMax}
        className="w-16 border border-slate-400 px-1 py-0 text-xs"
      />
    </div>
  )
}

function NumberEqualsFilterForUnsafeValue({
  value,
  onChangeValue,
}: {
  value: unknown
  onChangeValue: (updater: Updater<unknown>) => void
}) {
  if (!(typeof value === 'number' || value === undefined)) {
    return <></>
  }

  return <NumberEqualsFilter value={value} onChangeValue={onChangeValue} />
}

function NumberEqualsFilter({
  value,
  onChangeValue,
}: {
  value: number | undefined
  onChangeValue: (value: number | undefined) => void
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value ? Number(e.target.value) : undefined
    onChangeValue(newValue)
  }

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-1 pb-1">
      <input
        type="number"
        placeholder="equals"
        // value に undefined を入力してしまうと、
        // Controlled コンポーネントとして動作しなくなるため、空文字として入力する
        // https://react.dev/link/controlled-components
        value={value ?? ''}
        onChange={handleChange}
        className="w-16 border border-slate-400 px-1 py-0 text-xs"
      />
    </div>
  )
}
