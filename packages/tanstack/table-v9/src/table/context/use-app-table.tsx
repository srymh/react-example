import {
  tableFeatures,
  sortFns,
  rowSortingFeature,
  createSortedRowModel,
  createTableHook,
  createTableHookContexts,
} from '@tanstack/react-table'

import { ColorCell } from '../../components/color-cell'
import {
  Table,
  TableHeaderSortIcon as SortIcon,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
} from '../../components/table'

const features = tableFeatures({
  rowSortingFeature, // enables sorting APIs and state
  sortedRowModel: createSortedRowModel(), // client-side sorting
  sortFns,
})

type AppTableFeatures = typeof features

const {
  tableContext,
  // useTableContext,
  headerContext,
  useHeaderContext,
  cellContext,
  // useCellContext,
} = createTableHookContexts<AppTableFeatures>()

function SortToggleHandler({ children }: { children: React.ReactNode }) {
  const { column } = useHeaderContext()

  return <div onClick={column.getToggleSortingHandler()}>{children}</div>
}

function TableHeaderSortIcon() {
  const { column } = useHeaderContext()

  return <SortIcon isSorted={column.getIsSorted()} />
}

export const { useAppTable, createAppColumnHelper } = createTableHook({
  features,
  tableContext,
  headerContext,
  cellContext,
  tableComponents: {
    Table,
    Head: TableHead,
    HeaderRow: TableHeaderRow,
    Body: TableBody,
    Row: TableRow,
  },
  headerComponents: {
    SortToggleHandler,
    SortIndicator: TableHeaderSortIcon,
    Cell: TableHeaderCell,
  },
  cellComponents: {
    Cell: TableCell,
    ColorCell,
  },
})
