import {
  tableFeatures,
  sortFns,
  rowSortingFeature,
  createSortedRowModel,
  createTableHook,
} from '@tanstack/react-table'

const features = tableFeatures({
  rowSortingFeature, // enables sorting APIs and state
  sortedRowModel: createSortedRowModel(), // client-side sorting
  sortFns,
})

export const { useAppTable, createAppColumnHelper } = createTableHook({
  features,
})
