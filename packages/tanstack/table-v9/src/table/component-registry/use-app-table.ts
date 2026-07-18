import {
  tableFeatures,
  sortFns,
  rowSortingFeature,
  createSortedRowModel,
  createTableHook,
} from '@tanstack/react-table'

import { ColorCell } from '../../components/color-cell'
import { TableHeaderSortIcon } from '../../components/table'

const features = tableFeatures({
  rowSortingFeature, // enables sorting APIs and state
  sortedRowModel: createSortedRowModel(), // client-side sorting
  sortFns,
})

export const { useAppTable, createAppColumnHelper } = createTableHook({
  features,
  headerComponents: {
    TableHeaderSortIcon,
  },
  cellComponents: {
    ColorCell,
  },
})
