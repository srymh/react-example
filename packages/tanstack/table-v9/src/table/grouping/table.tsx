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
import {
  CirclePlusIcon,
  CircleMinusIcon,
  FolderOpenIcon,
  FolderIcon,
  FolderTreeIcon,
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
  columnHelper.accessor(
    ({ hue }) => {
      // 色相である程度分ける. 赤っぽい色、青っぽい色など
      if (hue < 15 || hue >= 345) return 'Red'
      if (hue < 45) return 'Orange'
      if (hue < 70) return 'Yellow'
      if (hue < 165) return 'Green'
      if (hue < 195) return 'Cyan'
      if (hue < 255) return 'Blue'
      if (hue < 345) return 'Purple'
      return 'Red'
    },
    { id: 'hue-group', header: 'Hue Group' },
  ),
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
  columnHelper.accessor('red', { header: 'Red' }),
  columnHelper.accessor('green', { header: 'Green' }),
  columnHelper.accessor('blue', { header: 'Blue' }),
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
    groupedColumnMode: groupedColumnMode, // グループ化された列を先頭に移動する
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
                      {header.column.getCanGroup() ? (
                        <>
                          {header.column.getIsGrouped() ? (
                            <FolderTreeIcon className="inline-block h-4 w-4" />
                          ) : null}
                        </>
                      ) : null}

                      <table.FlexRender header={header} />

                      {header.column.getCanGroup() ? (
                        <button
                          type="button"
                          className="cursor-pointer"
                          onClick={header.column.getToggleGroupingHandler()}
                        >
                          {header.column.getIsGrouped() ? (
                            <CircleMinusIcon className="inline-block h-3 w-3" />
                          ) : (
                            <CirclePlusIcon className="inline-block h-3 w-3" />
                          )}
                        </button>
                      ) : null}
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
                    {cell.getIsGrouped() ? (
                      <button
                        onClick={row.getToggleExpandedHandler()}
                        style={{
                          cursor: row.getCanExpand() ? 'pointer' : 'normal',
                        }}
                      >
                        {row.getIsExpanded() ? (
                          <FolderOpenIcon className="mr-1 inline-block h-4 w-4 fill-amber-400" />
                        ) : (
                          <FolderIcon className="mr-1 inline-block h-4 w-4 fill-amber-400" />
                        )}
                        <table.FlexRender cell={cell} /> ({row.subRows.length.toLocaleString()})
                      </button>
                    ) : cell.getIsPlaceholder() ? (
                      <>
                        {cell.column.getGroupedIndex() === 0 ? (
                          <div className="ml-1 text-gray-400">|</div>
                        ) : row.getIsGrouped() ? (
                          <div className="h-2 w-full rounded-2xl bg-gray-200 text-gray-400"></div>
                        ) : (
                          <div className="ml-1 text-gray-400">|</div>
                        )}
                      </>
                    ) : row.getIsGrouped() ? (
                      <div className="h-2 w-full rounded-2xl bg-gray-200 text-gray-400"></div>
                    ) : (
                      <table.FlexRender cell={cell} />
                    )}
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
