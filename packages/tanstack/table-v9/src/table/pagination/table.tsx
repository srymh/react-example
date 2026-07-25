import { useEffect } from 'react'

import {
  tableFeatures,
  useTable,
  createColumnHelper,
  rowPaginationFeature,
  createPaginatedRowModel,
} from '@tanstack/react-table'
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react'

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
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
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
    initialState: {},
  })

  const handleReset = () => {
    table.resetPagination(true)
  }

  const handleResetInitial = () => {
    table.resetPagination(false)
  }

  useEffect(() => {
    const { unsubscribe } = table.atoms.pagination.subscribe((pagination) => {
      console.log('Pagination changed:', pagination)
    })
    return () => unsubscribe()
  }, [table])

  return (
    <Card title="Pagination" description="Table with pagination using useTable and tableFeatures">
      <div className="min-w-30 flex-1 overflow-auto">
        <TableComponent
          renderBottomController={
            <div className="flex w-full items-center justify-between px-1 py-1 text-sm">
              <div className="flex items-center justify-start gap-2">
                <div className="grid grid-cols-[auto_auto_auto] items-center gap-1 font-mono">
                  <div>{table.state.pagination.pageIndex + 1}</div>
                  <div>/</div>
                  <div>{table.getPageCount()}</div>
                </div>
                <select
                  value={table.state.pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value))
                  }}
                  className="rounded border border-slate-400 bg-slate-600 px-1 py-0 text-xs text-white shadow-md hover:bg-slate-500 active:translate-y-0.5 active:shadow-sm disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-slate-200"
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end gap-1">
                <Button onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
                  <ChevronsLeftIcon className="h-3 w-3" />
                </Button>
                <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                  <ChevronLeftIcon className="h-3 w-3" />
                </Button>
                <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                  <ChevronRightIcon className="h-3 w-3" />
                </Button>
                <Button onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
                  <ChevronsRightIcon className="h-3 w-3" />
                </Button>
              </div>
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
          <Button onClick={handleReset}>Reset</Button>
          <Button onClick={handleResetInitial}>Reset Initial</Button>
        </div>
        <pre className="m-0 overflow-auto p-2 text-xs">{JSON.stringify(table.state, null, 2)}</pre>
      </div>
    </Card>
  )
}
