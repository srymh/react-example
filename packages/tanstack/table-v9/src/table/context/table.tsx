import { SortAscIcon } from 'lucide-react'

import { Button } from '../../components/button'
import { Card } from '../../components/card'
import type { Color } from '../../data/color'
import { createAppColumnHelper, useAppTable } from './use-app-table'

const columnHelper = createAppColumnHelper<Color>()

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'color',
    header: 'Color',
    cell: ({ cell, row }) => <cell.ColorCell {...row.original} />,
  }),
  columnHelper.accessor('red', { header: 'Red' }),
  columnHelper.accessor('green', { header: 'Green' }),
  columnHelper.accessor('blue', { header: 'Blue' }),
])

const initialSorting = [{ id: 'red', desc: true }]

export function Table({ data }: { data: Color[] }) {
  const table = useAppTable({
    columns,
    data,
    initialState: {
      sorting: initialSorting,
    },
  })

  const handleResetSorting = () => {
    table.setSorting(initialSorting)
  }

  // Greenを昇順にソートする
  const handleSortGreenAsc = () => {
    table.setSorting([{ id: 'green', desc: false }])
  }

  // 現在のソート順の末尾にBlueの昇順ソートを追加する
  const handleSortBlueAsc = () => {
    table.setSorting((prev) => {
      const newSorting = [...prev]
      if (!newSorting.find((s) => s.id === 'blue' && s.desc === false)) {
        newSorting.push({ id: 'blue', desc: false })
      }
      return newSorting
    })
  }

  return (
    <Card title="Context">
      <div className="flex-1">
        <table.AppTable>
          <table.Table>
            <table.Head headerGroups={table.getHeaderGroups()}>
              {({ headers }) => (
                <table.HeaderRow headers={headers}>
                  {(h) => (
                    <table.AppHeader header={h}>
                      {(header) => (
                        <header.Cell>
                          <header.SortToggleHandler>
                            <header.FlexRender />
                            <header.SortIndicator />
                          </header.SortToggleHandler>
                        </header.Cell>
                      )}
                    </table.AppHeader>
                  )}
                </table.HeaderRow>
              )}
            </table.Head>

            <table.Body rows={table.getRowModel().rows}>
              {(row) => (
                <table.Row cells={row.getAllCells()}>
                  {(c) => (
                    <table.AppCell cell={c}>
                      {(cell) => (
                        <cell.Cell>
                          <cell.FlexRender />
                        </cell.Cell>
                      )}
                    </table.AppCell>
                  )}
                </table.Row>
              )}
            </table.Body>
          </table.Table>
        </table.AppTable>
      </div>

      <div className="flex h-full w-50 shrink-0 flex-col gap-0 border border-slate-400 bg-slate-100">
        <div className="flex flex-wrap items-center justify-center gap-1 border-b border-slate-400 p-1">
          <Button onClick={handleResetSorting}>Reset Sort</Button>
          <Button onClick={handleSortGreenAsc}>
            <span className="flex items-center">
              Green Asc
              <SortAscIcon className="ml-1 h-3 w-3" />
            </span>
          </Button>
          <Button onClick={handleSortBlueAsc}>
            <span className="flex items-center">
              Add Blue Asc
              <SortAscIcon className="ml-1 h-3 w-3" />
            </span>
          </Button>
        </div>
        <pre className="m-0 overflow-auto p-2 text-xs">{JSON.stringify(table.state, null, 2)}</pre>
      </div>
    </Card>
  )
}
