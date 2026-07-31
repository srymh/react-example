import { useCallback, useLayoutEffect, useRef, useState } from 'react'

import type { RowData, Table_RowPinning, TableFeatures } from '@tanstack/react-table'

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
export type PinnedRowOffsets = {
  top: Record<string, number>
  bottom: Record<string, number>
}

export function usePinnedRowOffsets<TFeatures extends TableFeatures, TData extends RowData>(
  table: Table_RowPinning<TFeatures, TData>,
) {
  const [pinnedRowOffsets, setPinnedRowOffsets] = useState<PinnedRowOffsets>({
    top: {},
    bottom: {},
  })

  const tableHeadRef = useRef<HTMLTableSectionElement>(null)
  const pinnedRowRefs = useRef(new Map<string, HTMLTableRowElement>())

  const topRowIds = table.getTopRows().map((row) => row.id)
  const bottomRowIds = table.getBottomRows().map((row) => row.id)
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

  return { pinnedRowOffsets, tableHeadRef, setPinnedRowRef }
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
