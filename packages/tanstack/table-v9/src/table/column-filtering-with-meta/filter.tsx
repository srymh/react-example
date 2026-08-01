import type {
  Column,
  Updater,
  TableFeatures,
  RowData,
  CellData,
  Column_ColumnFiltering,
} from '@tanstack/react-table'

import {
  NumberEqualsFilterForUnsafeValue,
  NumberRangeFilterForUnsafeValue,
} from '../../components/filter'

export type MyColumnMeta = {
  filterVariant?: 'number-range' | 'number-equals'
}

export type FilterableColumn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Column<TFeatures, TData, TValue> &
  Column_ColumnFiltering<TFeatures, TData> & {
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
      return <NumberRangeFilterForUnsafeValue value={value} onChangeValue={handleChangeValue} />
    case 'number-equals':
      return <NumberEqualsFilterForUnsafeValue value={value} onChangeValue={handleChangeValue} />
    default:
      return <></>
  }
}
