import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import {
  tableFeatures,
  useTable,
  createColumnHelper,
  rowPinningFeature,
} from '@tanstack/react-table'
import { PinIcon, PinOffIcon, PanelRightIcon } from 'lucide-react'

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
  rowPinningFeature,
})

const columnHelper = createColumnHelper<typeof features, Color>()

/**
 * 可変高さのピン留め行に対する sticky offset。
 *
 * @remarks
 * `position: sticky` の適用と `top` / `bottom` の反映は CSS に任せ、JS では
 * `thead` と pinned row の高さを `ResizeObserver` で実測し、累積 offset だけを算出する。
 *
 * この方式は固定値より柔軟だが、初回描画後に計測するため位置が未確定の瞬間がありえる。
 * また、監視対象が増えるほど layout read と state update の負荷が増えるため、
 * pinned row は上下合計で 10-20 行程度までに抑えるのが望ましい。
 *
 * 制約として、row id は安定していること、pinned row は仮想化で DOM から外さないこと、
 * 高さアニメーションや頻繁に高さが変わる非同期コンテンツは避けることを前提にする。
 * 1 行の高さは 120px 程度まで、header は 100px 程度までを目安にする。
 */
type PinnedRowOffsets = {
  top: Record<string, number>
  bottom: Record<string, number>
}

function areOffsetsEqual(a: PinnedRowOffsets, b: PinnedRowOffsets) {
  return areOffsetRecordsEqual(a.top, b.top) && areOffsetRecordsEqual(a.bottom, b.bottom)
}

function areOffsetRecordsEqual(a: Record<string, number>, b: Record<string, number>) {
  const aKeys = Object.keys(a)

  if (aKeys.length !== Object.keys(b).length) {
    return false
  }

  return aKeys.every((key) => a[key] === b[key])
}

export function Table({ data }: { data: Color[] }) {
  const [showAction, setShowAction] = useState(true)
  const [pinnedRowOffsets, setPinnedRowOffsets] = useState<PinnedRowOffsets>({
    top: {},
    bottom: {},
  })
  const tableHeadRef = useRef<HTMLTableSectionElement>(null)
  const pinnedRowRefs = useRef(new Map<string, HTMLTableRowElement>())

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
                cell: ({ row }) => (
                  <div className="flex h-full w-full items-center justify-center gap-1">
                    <button
                      onClick={() => {
                        if (row.getIsPinned() === 'top') {
                          row.pin(false)
                        } else {
                          row.pin('top')
                        }
                      }}
                      className="group cursor-pointer border border-dashed border-gray-400 hover:border-gray-500"
                    >
                      {row.getIsPinned() === 'top' ? (
                        <PinOffIcon className="h-3 w-3 rotate-180 stroke-gray-400 group-hover:stroke-gray-500" />
                      ) : (
                        <PinIcon className="h-3 w-3 rotate-180 stroke-gray-400 group-hover:stroke-gray-500" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (row.getIsPinned() === 'bottom') {
                          row.pin(false)
                        } else {
                          row.pin('bottom')
                        }
                      }}
                      className="group cursor-pointer border border-dashed border-gray-400 hover:border-gray-500"
                    >
                      {row.getIsPinned() === 'bottom' ? (
                        <PinOffIcon className="h-3 w-3 stroke-gray-400 group-hover:stroke-gray-500" />
                      ) : (
                        <PinIcon className="h-3 w-3 stroke-gray-400 group-hover:stroke-gray-500" />
                      )}
                    </button>
                  </div>
                ),
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

  const topRows = table.getTopRows()
  const centerRows = table.getCenterRows()
  const bottomRows = table.getBottomRows()
  const topRowIds = topRows.map((row) => row.id)
  const bottomRowIds = bottomRows.map((row) => row.id)
  const topRowIdsKey = JSON.stringify(topRowIds)
  const bottomRowIdsKey = JSON.stringify(bottomRowIds)

  const setPinnedRowRef = useCallback((rowId: string, node: HTMLTableRowElement | null) => {
    if (node) {
      pinnedRowRefs.current.set(rowId, node)
    } else {
      pinnedRowRefs.current.delete(rowId)
    }
  }, [])

  useLayoutEffect(() => {
    const measurePinnedOffsets = () => {
      const nextOffsets: PinnedRowOffsets = {
        top: {},
        bottom: {},
      }

      let topOffset = tableHeadRef.current?.getBoundingClientRect().height ?? 0

      for (const rowId of topRowIds) {
        nextOffsets.top[rowId] = topOffset
        topOffset += pinnedRowRefs.current.get(rowId)?.getBoundingClientRect().height ?? 0
      }

      let bottomOffset = 0

      for (let index = bottomRowIds.length - 1; index >= 0; index--) {
        const rowId = bottomRowIds[index]

        nextOffsets.bottom[rowId] = bottomOffset
        bottomOffset += pinnedRowRefs.current.get(rowId)?.getBoundingClientRect().height ?? 0
      }

      setPinnedRowOffsets((prevOffsets) =>
        areOffsetsEqual(prevOffsets, nextOffsets) ? prevOffsets : nextOffsets,
      )
    }

    measurePinnedOffsets()

    if (typeof ResizeObserver === 'undefined') {
      return
    }

    const resizeObserver = new ResizeObserver(measurePinnedOffsets)
    const observedElements = [
      tableHeadRef.current,
      ...topRowIds.map((rowId) => pinnedRowRefs.current.get(rowId)),
      ...bottomRowIds.map((rowId) => pinnedRowRefs.current.get(rowId)),
    ]

    for (const element of observedElements) {
      if (element) {
        resizeObserver.observe(element)
      }
    }

    return () => resizeObserver.disconnect()
  }, [topRowIds, bottomRowIds, topRowIdsKey, bottomRowIdsKey])

  return (
    <Card title="Row Pinning" description="Row pinning with useTable and tableFeatures">
      <div className="min-w-30 flex-1 overflow-auto">
        <TableComponent
          renderTopController={
            <div className="flex w-full items-center justify-end px-1 py-0.5">
              <button onClick={() => setShowAction((prev) => !prev)}>
                <PanelRightIcon className="h-4 w-4" />
              </button>
            </div>
          }
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

          <TableBody rows={[...topRows, ...centerRows, ...bottomRows]}>
            {(row) => {
              const isPinned = row.getIsPinned()
              const dataIsPinned = isPinned ? { 'data-is-pinned': isPinned } : {}

              const pinnedIndex = row.getPinnedIndex()
              const pinnedTop = isPinned === 'top' ? pinnedRowOffsets.top[row.id] : undefined
              const pinnedBottom =
                isPinned === 'bottom' ? pinnedRowOffsets.bottom[row.id] : undefined

              const style = {
                '--pinned-top': typeof pinnedTop === 'number' ? `${pinnedTop}px` : undefined,
                '--pinned-bottom':
                  typeof pinnedBottom === 'number' ? `${pinnedBottom}px` : undefined,
              } as React.CSSProperties

              // TOPにピン留めされた行の内の最後の行かどうか
              const isLastRowOfTop = isPinned === 'top' && pinnedIndex === topRows.length - 1
              const dataIsLastRowOfTop = isLastRowOfTop ? { 'data-is-last-row-of-top': true } : {}

              // BOTTOMにピン留めされた行の内の最初の行かどうか
              const isFirstRowOfBottom = isPinned === 'bottom' && pinnedIndex === 0
              const dataIsFirstRowOfBottom = isFirstRowOfBottom
                ? { 'data-is-first-row-of-bottom': true }
                : {}

              // ピン留めされていない行の内の最初の行かどうか
              const isFirstRowOfCenter = centerRows[0]?.id === row.id
              const dataIsFirstRowOfCenter = isFirstRowOfCenter
                ? { 'data-is-first-row-of-center': true }
                : {}

              // ピン留めされていない行の内の最後の行かどうか
              const isLastRowOfCenter = centerRows[centerRows.length - 1]?.id === row.id
              const dataIsLastRowOfCenter = isLastRowOfCenter
                ? { 'data-is-last-row-of-center': true }
                : {}

              // TOPにピン留めされた行の最後の行の下側に影をつけるためのクラス名
              const topPinnedRowsShadowClassName =
                ' data-is-last-row-of-top:[&>td]:border-b-0 data-is-last-row-of-top:after:pointer-events-none data-is-last-row-of-top:after:absolute data-is-last-row-of-top:after:-bottom-3 data-is-last-row-of-top:after:left-0 data-is-last-row-of-top:after:h-3 data-is-last-row-of-top:after:w-full data-is-last-row-of-top:after:bg-[linear-gradient(to_bottom,rgba(15,23,42,0.16),rgba(15,23,42,0.06),transparent)]'

              // BOTTOMにピン留めされた行の最初の行の上側に影をつけるためのクラス名
              const bottomPinnedRowShadowClassName =
                ' data-is-first-row-of-bottom:after:pointer-events-none data-is-first-row-of-bottom:after:absolute data-is-first-row-of-bottom:after:-top-3 data-is-first-row-of-bottom:after:left-0 data-is-first-row-of-bottom:after:h-3 data-is-first-row-of-bottom:after:w-full data-is-first-row-of-bottom:after:bg-[linear-gradient(to_top,rgba(15,23,42,0.16),rgba(15,23,42,0.06),transparent)]'

              return (
                <TableRow
                  ref={isPinned ? (node) => setPinnedRowRef(row.id, node) : undefined}
                  cells={row.getAllCells()}
                  {...dataIsPinned}
                  {...dataIsLastRowOfTop}
                  {...dataIsFirstRowOfCenter}
                  {...dataIsLastRowOfCenter}
                  {...dataIsFirstRowOfBottom}
                  style={style}
                  className={
                    'data-is-pinned:sticky data-is-pinned:bg-white data-[is-pinned="bottom"]:bottom-(--pinned-bottom) data-[is-pinned="bottom"]:z-10 data-[is-pinned="top"]:top-(--pinned-top) data-[is-pinned="top"]:z-10 data-is-last-row-of-center:[&>td]:border-b-0' +
                    topPinnedRowsShadowClassName +
                    bottomPinnedRowShadowClassName
                  }
                >
                  {(cell) => (
                    <TableCell>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  )}
                </TableRow>
              )
            }}
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
