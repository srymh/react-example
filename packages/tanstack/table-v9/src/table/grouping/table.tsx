import { useEffect, useState } from 'react'

import {
  tableFeatures,
  useTable,
  createColumnHelper,
  rowExpandingFeature,
  columnGroupingFeature,
  createExpandedRowModel,
  createGroupedRowModel,
} from '@tanstack/react-table'
import type {
  Cell,
  CellData,
  Cell_ColumnGrouping,
  Column_ColumnGrouping,
  Header,
  RowData,
  Row_ColumnGrouping,
  Row_RowExpanding,
  TableFeatures,
} from '@tanstack/react-table'
import {
  CirclePlusIcon,
  CircleMinusIcon,
  FolderOpenIcon,
  FolderIcon,
  FolderTreeIcon,
} from 'lucide-react'

import { Button } from '../../components/button'
import { Card } from '../../components/card'
import { BlueCell, ColorCell, GreenCell, RedCell } from '../../components/color-cell'
import {
  Table as TableComponent,
  TableCell,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
  TableHead,
  TableBody,
} from '../../components/table'
import { categorizeHue } from '../../data/color'
import type { Color } from '../../data/color'

const features = tableFeatures({
  rowExpandingFeature,
  columnGroupingFeature,
  expandedRowModel: createExpandedRowModel(),
  groupedRowModel: createGroupedRowModel(),
})

const columnHelper = createColumnHelper<typeof features, Color>()

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'color',
    header: 'Color',
    cell: (props) => <ColorCell {...props.row.original} />,
  }),
  columnHelper.accessor(({ hue }) => categorizeHue(hue), { id: 'hue-group', header: 'Hue Group' }),
  columnHelper.accessor(
    ({ saturation }) => {
      if (saturation < 20) return '[0-20)'
      if (saturation < 40) return '[20-40)'
      if (saturation < 60) return '[40-60)'
      if (saturation < 80) return '[60-80)'
      return '[80-100]'
    },
    { id: 'saturation-group', header: 'Saturation Group' },
  ),
  columnHelper.accessor('red', {
    header: 'Red',
    cell: (props) => <RedCell red={props.getValue()} />,
  }),
  columnHelper.accessor('green', {
    header: 'Green',
    cell: (props) => <GreenCell green={props.getValue()} />,
  }),
  columnHelper.accessor('blue', {
    header: 'Blue',
    cell: (props) => <BlueCell blue={props.getValue()} />,
  }),
  columnHelper.accessor('hue', { header: 'Hue' }),
  columnHelper.accessor('saturation', { header: 'Saturation' }),
  columnHelper.accessor('lightness', { header: 'Lightness' }),
])

export function Table({ data }: { data: Color[] }) {
  const [groupedColumnMode, setGroupedColumnMode] = useState<'reorder' | 'remove' | false>(
    'reorder',
  )

  const table = useTable({
    features,
    columns,
    data,
    initialState: {
      grouping: ['hue-group'],
    },
    groupedColumnMode: groupedColumnMode,
  })

  const handleReset = () => {
    table.resetGrouping(true)
  }

  const handleResetInitial = () => {
    table.resetGrouping()
  }

  const handleGroupByRed = () => {
    table.setGrouping(['red'])
  }

  useEffect(() => {
    const { unsubscribe } = table.atoms.grouping.subscribe((grouping) => {
      console.log('Grouping changed:', grouping)
    })

    return () => unsubscribe()
  }, [table])

  return (
    <Card title="Grouping" description="Grouping with useTable and tableFeatures">
      <div className="min-w-30 flex-1 overflow-auto">
        <TableComponent>
          <TableHead headerGroups={table.getHeaderGroups()}>
            {(headerGroup) => (
              <TableHeaderRow headers={headerGroup.headers}>
                {(header) => (
                  <TableHeaderCell>
                    <div className="flex items-center justify-center gap-1">
                      <TableHeaderCellGroupIcon header={header} />
                      <table.FlexRender header={header} />
                      <TableHeaderCellGroupToggleButton header={header} />
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
                    <TableCellWithGrouping cell={cell}>
                      <table.FlexRender cell={cell} />
                    </TableCellWithGrouping>
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
          <Button onClick={handleGroupByRed}>Group by Red</Button>
          <Button onClick={() => setGroupedColumnMode('remove')}>Remove Grouped Column</Button>
          <Button onClick={() => setGroupedColumnMode('reorder')}>Reorder Grouped Column</Button>
          <Button onClick={() => setGroupedColumnMode(false)}>No Grouped Column</Button>
        </div>
        <pre className="m-0 overflow-auto p-2 text-xs">{JSON.stringify(table.state, null, 2)}</pre>
      </div>
    </Card>
  )
}

type GroupableHeader<TFeatures extends TableFeatures, TData extends RowData> = Header<
  TFeatures,
  TData
> & {
  column: Header<TFeatures, TData>['column'] & Column_ColumnGrouping<TFeatures, TData>
}

type GroupableCell<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Cell<TFeatures, TData, TValue> &
  Cell_ColumnGrouping & {
    column: Cell<TFeatures, TData, TValue>['column'] & Column_ColumnGrouping<TFeatures, TData>
    row: Cell<TFeatures, TData, TValue>['row'] & Row_ColumnGrouping & Row_RowExpanding
  }

function TableHeaderCellGroupIcon<TFeatures extends TableFeatures, TData extends RowData>({
  header,
}: {
  header: GroupableHeader<TFeatures, TData>
}) {
  const canGroup = header.column.getCanGroup()

  if (!canGroup) {
    return null
  }

  const isGrouped = header.column.getIsGrouped()

  if (!isGrouped) {
    return null
  }

  return <FolderTreeIcon className="inline-block h-4 w-4" />
}

function TableHeaderCellGroupToggleButton<TFeatures extends TableFeatures, TData extends RowData>({
  header,
}: {
  header: GroupableHeader<TFeatures, TData>
}) {
  const canGroup = header.column.getCanGroup()

  if (!canGroup) {
    return null
  }

  const isGrouped = header.column.getIsGrouped()

  const Icon = isGrouped ? CircleMinusIcon : CirclePlusIcon

  return (
    <button
      type="button"
      className="cursor-pointer"
      onClick={header.column.getToggleGroupingHandler()}
    >
      <Icon className="inline-block h-3 w-3" />
    </button>
  )
}

function TableCellWithGrouping<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>({
  children,
  cell,
}: {
  children?: React.ReactNode
  cell: GroupableCell<TFeatures, TData, TValue>
}) {
  const isCellGrouped = cell.getIsGrouped()
  const isPlaceholder = cell.getIsPlaceholder()
  const isRowGrouped = cell.row.getIsGrouped()
  const isRowExpanded = cell.row.getIsExpanded()
  const canRowExpand = cell.row.getCanExpand()
  const columnGroupedIndex = cell.column.getGroupedIndex()
  const toggleExpandedHandler = cell.row.getToggleExpandedHandler()
  const subRowsLength = cell.row.subRows.length

  const shouldRenderValue = !isCellGrouped && !isPlaceholder && !isRowGrouped
  const shouldRenderIndicator = isPlaceholder && (columnGroupedIndex === 0 || !isRowGrouped)

  const Icon = isRowExpanded ? FolderOpenIcon : FolderIcon
  const FolderOpeningIndicator = () => <div className="ml-1 text-gray-400">|</div>
  const MaskedCell = () => <div className="h-2 w-full rounded-2xl bg-gray-200"></div>

  if (shouldRenderValue) {
    return children
  }

  if (isCellGrouped) {
    return (
      <button
        onClick={toggleExpandedHandler}
        className={`flex flex-nowrap items-center justify-center gap-1 truncate ${canRowExpand ? 'cursor-pointer' : ''}`}
      >
        <Icon className="h-3 w-3 fill-amber-400" />
        {children}
        <span className="text-xs text-gray-500">({subRowsLength.toString()})</span>
      </button>
    )
  }

  if (shouldRenderIndicator) {
    return <FolderOpeningIndicator />
  }

  return <MaskedCell />
}
