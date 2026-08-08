import { rankItem } from '@tanstack/match-sorter-utils'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type { FilterFn, RowData, TableFeatures } from '@tanstack/react-table'

export interface FuzzyFilterMeta {
  itemRank?: RankingInfo
}

// A features type that carries the filterMeta shape
export type FuzzyFeatures = TableFeatures & { filterMeta: FuzzyFilterMeta }

export const fuzzyFilter: FilterFn<FuzzyFeatures, RowData> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta?.({ itemRank })

  // Return if the item should be filtered in/out
  return itemRank.passed
}
