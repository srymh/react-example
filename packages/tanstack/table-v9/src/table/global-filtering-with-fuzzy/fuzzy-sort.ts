import { compareItems } from '@tanstack/match-sorter-utils'
import { sortFn_alphanumeric } from '@tanstack/react-table'
import type { RowData, SortFn } from '@tanstack/react-table'

import type { FuzzyFeatures } from './fuzzy-filter'

export const fuzzySort: SortFn<FuzzyFeatures, RowData> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank!,
      rowB.columnFiltersMeta[columnId].itemRank!,
    )
  }

  // Provide an alphanumeric sort as a fallback for when the item ranks are equal
  return dir === 0 ? sortFn_alphanumeric(rowA, rowB, columnId) : dir
}
