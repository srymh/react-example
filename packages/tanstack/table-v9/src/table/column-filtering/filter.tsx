import type {
  Column,
  Updater,
  TableFeatures,
  RowData,
  CellData,
  Column_ColumnFiltering,
} from '@tanstack/react-table'

import { NumberRangeFilterForUnsafeValue } from '../../components/filter'

type FilterableColumn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Column<TFeatures, TData, TValue> & Column_ColumnFiltering<TFeatures, TData>

export function Filter<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>({ column }: { column: FilterableColumn<TFeatures, TData, TValue> }) {
  const value = column.getFilterValue()
  const handleChangeValue = (updater: Updater<unknown>) => {
    column.setFilterValue(updater)
  }

  return <NumberRangeFilterForUnsafeValue value={value} onChangeValue={handleChangeValue} />
}
