import { useEffect, useMemo, useState } from 'react'

import {
  tableFeatures,
  useTable,
  createColumnHelper,
  rowPinningFeature,
} from '@tanstack/react-table'
import { PanelRightCloseIcon, PanelRightOpenIcon } from 'lucide-react'

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
} from '../../components/table'
import type { Color } from '../../data/color'
import { ActionCell } from './action-cell'
import { TableRowWithRowPinning } from './table-row-with-row-pinning'
import { usePinnedRowOffsets } from './use-pinned-row-offsets'

const features = tableFeatures({
  rowPinningFeature,
})

const columnHelper = createColumnHelper<typeof features, Color>()

export function Table({ data }: { data: Color[] }) {
  const [showAction, setShowAction] = useState(true)

  const columns = useMemo(
    () =>
      columnHelper.columns([
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
        ...(showAction
          ? [
              columnHelper.display({
                id: '__action__',
                header: 'Action',
                cell: ({ row }) => <ActionCell row={row} />,
              }),
            ]
          : []),
      ]),
    [showAction],
  )

  const table = useTable({
    features,
    columns,
    data,
    initialState: {
      rowPinning: {
        top: ['0'],
        bottom: ['1'],
      },
    },
  })

  const handleReset = () => {
    table.resetRowPinning(true)
  }

  const handleResetInitial = () => {
    table.resetRowPinning()
  }

  useEffect(() => {
    const { unsubscribe } = table.atoms.rowPinning.subscribe((rowPinning) => {
      console.log('Row pinning changed:', rowPinning)
    })

    return () => unsubscribe()
  }, [table])

  const { pinnedRowOffsets, tableHeadRef, setPinnedRowRef } = usePinnedRowOffsets(table)

  const [showRightPanel, setShowRightPanel] = useState(false)

  return (
    <Card title="Row Pinning" description="Row pinning with useTable and tableFeatures">
      <div className="min-w-30 flex-1 overflow-auto">
        <TableComponent
          renderTopController={
            <div className="flex w-full items-center justify-end px-1 py-0.5">
              <button onClick={() => setShowRightPanel((prev) => !prev)}>
                {showRightPanel ? (
                  <PanelRightCloseIcon className="h-4 w-4" />
                ) : (
                  <PanelRightOpenIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          }
          renderRightPanel={
            <div className="flex h-full w-full flex-col">
              <button
                className="flex w-full items-center justify-end px-1 py-0.5"
                onClick={() => setShowRightPanel((prev) => !prev)}
              >
                {showRightPanel ? (
                  <PanelRightCloseIcon className="h-4 w-4" />
                ) : (
                  <PanelRightOpenIcon className="h-4 w-4" />
                )}
              </button>
              <div className="m-2 min-h-0 w-full flex-1">
                <div className="flex items-center gap-1">
                  <input
                    id="show-action"
                    type="checkbox"
                    checked={showAction}
                    onChange={(e) => setShowAction(e.target.checked)}
                  />
                  <label htmlFor="show-action" className="text-nowrap">
                    Show Action Column
                  </label>
                </div>
              </div>
            </div>
          }
          showRightPanel={showRightPanel}
          onRightPanelClose={() => setShowRightPanel(false)}
        >
          <TableHead ref={tableHeadRef} headerGroups={table.getHeaderGroups()}>
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

          <TableBody
            rows={[...table.getTopRows(), ...table.getCenterRows(), ...table.getBottomRows()]}
          >
            {(row) => (
              <TableRowWithRowPinning
                row={row}
                pinnedRowOffsets={pinnedRowOffsets}
                setPinnedRowRef={setPinnedRowRef}
              >
                {(cell) => (
                  <TableCell>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                )}
              </TableRowWithRowPinning>
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
