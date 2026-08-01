import { constructFilterFn } from '@tanstack/react-table'
import type {
  Column,
  Updater,
  TableFeatures,
  RowData,
  CellData,
  Column_ColumnFiltering,
  Column_ColumnFaceting,
} from '@tanstack/react-table'

import { NumberRangeFilterForUnsafeValue } from '../../components/filter'

export type MyColumnMeta = {
  filterVariant?: 'number-range' | 'number-equals' | 'number-range-bucket'
}

export type RangeBucket =
  | 'under-20'
  | '[20, 40)'
  | '[40, 60)'
  | '[60, 80)'
  | '[80, 100)'
  | 'over-100'

export function getRangeBucket(value: number): RangeBucket {
  if (value < 20) return 'under-20'
  if (value < 40) return '[20, 40)'
  if (value < 60) return '[40, 60)'
  if (value < 80) return '[60, 80)'
  if (value < 100) return '[80, 100)'
  return 'over-100'
}

export const rangeBucketFilter = constructFilterFn({
  resolveDataValue: (value) => getRangeBucket(value as number),
  filter: (dataValue, filterValue) => {
    const result = filterValue === dataValue
    console.log(`dataValue: ${dataValue}, filterValue: ${filterValue}, result: ${result}`)
    return result
  },
  autoRemove: (filterValue) => {
    return filterValue == null
  },
})

type FilterableColumn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Column<TFeatures, TData, TValue> &
  Column_ColumnFiltering<TFeatures, TData> &
  Column_ColumnFaceting<TFeatures, TData> & {
    columnDef: {
      meta?: MyColumnMeta
    }
  }

export function Filter<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>({ column }: { column: FilterableColumn<TFeatures, TData, TValue> }) {
  const filterVariant = column.columnDef.meta?.filterVariant
  const value = column.getFilterValue()
  const handleChangeValue = (updater: Updater<unknown>) => {
    column.setFilterValue(updater)
  }

  switch (filterVariant) {
    case 'number-range':
      const [min, max] = column.getFacetedMinMaxValues() ?? []
      return (
        <NumberRangeFilterForUnsafeValue
          value={value}
          onChangeValue={handleChangeValue}
          min={min}
          max={max}
        />
      )
    case 'number-equals': {
      const suggestions = Array.from(column.getFacetedUniqueValues().entries()).sort(
        ([a], [b]) => Number(a) - Number(b),
      )

      if (typeof value !== 'number' && value !== undefined) {
        return <div>⚠️想定外の値です</div>
      }

      return (
        <select
          className="w-full border border-slate-400 px-1 py-0 text-xs"
          value={value ?? ''}
          onChange={(e) => handleChangeValue(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">未選択</option>
          {suggestions.map(([facetedValue, count]) => (
            <option key={String(facetedValue)} value={String(facetedValue)}>
              {facetedValue} ({count})
            </option>
          ))}
        </select>
      )
    }
    case 'number-range-bucket': {
      const suggestions = Array.from(column.getFacetedUniqueValues().entries()).sort(([a], [b]) => {
        const order: Record<RangeBucket, number> = {
          'over-100': 0,
          '[80, 100)': 1,
          '[60, 80)': 2,
          '[40, 60)': 3,
          '[20, 40)': 4,
          'under-20': 5,
        }
        return order[a as RangeBucket] - order[b as RangeBucket]
      })

      if (typeof value !== 'string' && value !== undefined) {
        return <div>⚠️想定外の値です</div>
      }

      return (
        <select
          className="w-full border border-slate-400 px-1 py-0 text-xs"
          value={value ?? ''}
          onChange={(e) => handleChangeValue(e.target.value || undefined)}
        >
          <option value="">未選択</option>
          {suggestions.map(([facetedValue, count]) => (
            <option key={String(facetedValue)} value={String(facetedValue)}>
              {facetedValue} ({count})
            </option>
          ))}
        </select>
      )
    }
    default:
      return <></>
  }
}
