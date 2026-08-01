import { useEffect } from 'react'

import {
  tableFeatures,
  useTable,
  createColumnHelper,
  rowSelectionFeature,
} from '@tanstack/react-table'
import { SquareIcon, SquareCheckBigIcon, SquareMinusIcon } from 'lucide-react'

import { Button } from '../../components/button'
import { Card } from '../../components/card'
import { ColorCell } from '../../components/color-cell'
import {
  Table as TableComponent,
  TableCell,
  TableHeaderCell,
  TableHeaderRow,
  TableHead,
  TableBody,
  TableRow,
} from '../../components/table'
import type { Color } from '../../data/color'

const features = tableFeatures({
  rowSelectionFeature,
})

const columnHelper = createColumnHelper<typeof features, Color>()

const columns = columnHelper.columns([
  columnHelper.display({
    id: '__select__',
    header: ({ table }) => (
      <SelectCell
        rowId="row-selection-all"
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <SelectCell
        rowId={row.id}
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  }),
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
      rowSelection: {},
    },
  })

  const handleReset = () => {
    table.resetRowSelection(true)
  }

  const handleResetInitial = () => {
    table.resetRowSelection()
  }

  useEffect(() => {
    const { unsubscribe } = table.atoms.rowSelection.subscribe((rowSelection) => {
      console.log('Row selection changed:', rowSelection)
    })

    return () => unsubscribe()
  }, [table])

  return (
    <Card title="Row Selection" description="Row selection allows you to select rows in the table.">
      <div className="min-w-30 flex-1 overflow-auto">
        <TableComponent>
          <TableHead headerGroups={table.getHeaderGroups()}>
            {(headerGroup) => (
              <TableHeaderRow headers={headerGroup.headers}>
                {(header) => (
                  <TableHeaderCell className="z-20">
                    <table.FlexRender header={header} />
                  </TableHeaderCell>
                )}
              </TableHeaderRow>
            )}
          </TableHead>

          <TableBody rows={table.getRowModel().rows}>
            {(row) => (
              <TableRow
                cells={row.getAllCells()}
                className={row.getIsSelected() ? '[&>td]:bg-gray-200' : ''}
              >
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

function SelectCell({
  rowId,
  checked = false,
  indeterminate = false,
  onChange,
}: {
  rowId: string
  checked?: boolean
  indeterminate?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const id = 'row-selection-' + rowId

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event)
  }

  const showUnchecked = !checked && !indeterminate
  const showChecked = checked
  const showIndeterminate = !checked && indeterminate

  return (
    <div className="relative h-full w-full px-1">
      <input
        type="checkbox"
        id={id}
        className="sr-only"
        checked={checked}
        onChange={handleChange}
      />
      <label htmlFor={id}>
        <SquareCheckBigIcon
          aria-hidden
          className={
            'absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-opacity duration-200 ' +
            (showChecked ? ' opacity-100' : 'pointer-events-none opacity-0')
          }
        />
        <SquareIcon
          aria-hidden
          className={
            'absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-opacity duration-200 ' +
            (showUnchecked ? ' opacity-100' : 'pointer-events-none opacity-0')
          }
        />
        <SquareMinusIcon
          aria-hidden
          className={
            'absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-opacity duration-200 ' +
            (showIndeterminate ? ' opacity-100' : 'pointer-events-none opacity-0')
          }
        />
      </label>
    </div>
  )
}
