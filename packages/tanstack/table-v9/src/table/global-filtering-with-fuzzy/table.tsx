import { useEffect } from 'react'

import {
  tableFeatures,
  useTable,
  createColumnHelper,
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  createFilteredRowModel,
  createSortedRowModel,
  metaHelper,
} from '@tanstack/react-table'
import type { Updater } from '@tanstack/react-table'

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
import { rgbToHex } from '../../data/color'
import type { Color } from '../../data/color'
import { fuzzyFilter } from './fuzzy-filter'
import type { FuzzyFilterMeta } from './fuzzy-filter'
import { fuzzySort } from './fuzzy-sort'

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { fuzzy: fuzzyFilter },
  sortFns: { fuzzy: fuzzySort },
  filterMeta: metaHelper<FuzzyFilterMeta>(),
})

const columnHelper = createColumnHelper<typeof features, Color>()

const columns = columnHelper.columns([
  columnHelper.accessor(({ red, green, blue }) => rgbToHex(red, green, blue), {
    id: 'color',
    header: 'Color',
    cell: (props) => <ColorCell {...props.row.original} quiet={false} />,
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
      globalFilter: '#88',
    },
    globalFilterFn: 'fuzzy',
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
    <Card
      title="Global Filtering with Fuzzy"
      description="This example shows how to use the fuzzy filter function to filter rows based on a global filter value."
    >
      <div className="min-w-30 flex-1 overflow-auto">
        <TableComponent
          topControllerSlot={
            <div className="flex h-full w-full items-center justify-start gap-1 px-1 py-1">
              <FuzzyFilterForUnsafeValue
                value={table.state.globalFilter}
                onChangeValue={(value) => table.setGlobalFilter(value)}
              />
              <Button onClick={handleResetGlobalFilter}>Clear</Button>
            </div>
          }
        >
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
        </div>
        <pre className="m-0 overflow-auto p-2 text-xs">{JSON.stringify(table.state, null, 2)}</pre>
      </div>
    </Card>
  )
}

export function FuzzyFilterForUnsafeValue({
  value,
  onChangeValue,
}: {
  value: unknown
  onChangeValue: (updater: Updater<unknown>) => void
}) {
  if (!(typeof value === 'string' || value === undefined)) {
    return <div>⚠️想定外の値です</div>
  }

  return <FuzzyFilter value={value} onChangeValue={onChangeValue} />
}

export function FuzzyFilter({
  value,
  onChangeValue,
}: {
  value: string | undefined
  onChangeValue: (value: string | undefined) => void
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.trim().length > 0 ? e.target.value : undefined
    onChangeValue(newValue)
  }

  return (
    <div className="flex w-auto flex-wrap items-center justify-start gap-1">
      <input
        type="text"
        placeholder="Filter..."
        // value に undefined を入力してしまうと、
        // Controlled コンポーネントとして動作しなくなるため、空文字として入力する
        // https://react.dev/link/controlled-components
        value={value ?? ''}
        onChange={handleChange}
        className="w-16 border border-slate-400 bg-white px-1 py-0 text-xs"
      />
    </div>
  )
}
