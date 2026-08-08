import { createData } from './data/color'
import { Table as BasicTable } from './table/basic/table'
import { Table as CellSelectionTable } from './table/cell-selection/table'
import { Table as ColumnFacetingTable } from './table/column-faceting/table'
import { Table as ColumnFilteringWithMetaTable } from './table/column-filtering-with-meta/table'
import { Table as ColumnFilteringTable } from './table/column-filtering/table'
import { Table as ColumnOrderingDndTable } from './table/column-ordering-dnd/table'
import { Table as ColumnOrderingTable } from './table/column-ordering/table'
import { Table as ColumnPinningTable } from './table/column-pinning/table'
import { Table as ColumnResizingTable } from './table/column-resizing/table'
import { Table as ColumnSizingTable } from './table/column-sizing/table'
import { Table as ColumnVisibilityTable } from './table/column-visibility/table'
import { Table as ComponentRegistryTable } from './table/component-registry/table'
import { Table as ComposableTable } from './table/composable/table'
import { Table as ContextTable } from './table/context/table'
import { Table as GlobalFilteringWithFuzzyTable } from './table/global-filtering-with-fuzzy/table'
import { Table as GlobalFilteringTable } from './table/global-filtering/table'
import { Table as GroupingTable } from './table/grouping/table'
import { Table as PaginationTable } from './table/pagination/table'
import { Table as RowPinningTable } from './table/row-pinning/table'
import { Table as RowSelectionTable } from './table/row-selection/table'
import { Table as SortTable } from './table/sort/table'

const data = createData(100)

export function App() {
  return (
    <div className="flex flex-col gap-4 p-2">
      <BasicTable data={data} />
      <hr className="my-4 border-t border-slate-400" />
      <h2 className="linear-gradient-text rounded bg-linear-to-r from-slate-500 to-slate-200 px-2 py-2 text-lg font-bold text-white">
        Sortable Table
      </h2>
      <SortTable data={data} />
      <hr className="my-4 border-t border-slate-400" />
      <h2 className="linear-gradient-text rounded bg-linear-to-r from-slate-500 to-slate-200 px-2 py-2 text-lg font-bold text-white">
        Column Ordering
      </h2>
      <ColumnOrderingTable data={data} />
      <ColumnOrderingDndTable data={data} />
      <hr className="my-4 border-t border-slate-400" />
      <h2 className="linear-gradient-text rounded bg-linear-to-r from-slate-500 to-slate-200 px-2 py-2 text-lg font-bold text-white">
        Column Sizing & Resizing
      </h2>
      <ColumnSizingTable data={data} />
      <ColumnResizingTable data={data} />
      <hr className="my-4 border-t border-slate-400" />
      <h2 className="linear-gradient-text rounded bg-linear-to-r from-slate-500 to-slate-200 px-2 py-2 text-lg font-bold text-white">
        Column Visibility
      </h2>
      <ColumnVisibilityTable data={data} />
      <hr className="my-4 border-t border-slate-400" />
      <h2 className="linear-gradient-text rounded bg-linear-to-r from-slate-500 to-slate-200 px-2 py-2 text-lg font-bold text-white">
        Column & Global Filtering
      </h2>
      <ColumnFilteringTable data={data} />
      <ColumnFilteringWithMetaTable data={data} />
      <ColumnFacetingTable data={data} />
      <GlobalFilteringTable data={data} />
      <GlobalFilteringWithFuzzyTable data={data} />
      <hr className="my-4 border-t border-slate-400" />
      <h2 className="linear-gradient-text rounded bg-linear-to-r from-slate-500 to-slate-200 px-2 py-2 text-lg font-bold text-white">
        Grouping
      </h2>
      <GroupingTable data={data} />
      <hr className="my-4 border-t border-slate-400" />
      <h2 className="linear-gradient-text rounded bg-linear-to-r from-slate-500 to-slate-200 px-2 py-2 text-lg font-bold text-white">
        Pagination
      </h2>
      <PaginationTable data={data} />
      <hr className="my-4 border-t border-slate-400" />
      <h2 className="linear-gradient-text rounded bg-linear-to-r from-slate-500 to-slate-200 px-2 py-2 text-lg font-bold text-white">
        Row & Column Pinning
      </h2>
      <ColumnPinningTable data={data} />
      <RowPinningTable data={data} />
      <hr className="my-4 border-t border-slate-400" />
      <h2 className="linear-gradient-text rounded bg-linear-to-r from-slate-500 to-slate-200 px-2 py-2 text-lg font-bold text-white">
        Row & Cell Selection
      </h2>
      <RowSelectionTable data={data} />
      <CellSelectionTable data={data} />
      <hr className="my-4 border-t border-slate-400" />
      <ComposableTable data={data} />
      <ComponentRegistryTable data={data} />
      <ContextTable data={data} />
    </div>
  )
}
