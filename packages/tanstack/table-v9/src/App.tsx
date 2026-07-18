import { createData } from './data/color'
import { Table as BasicTable } from './table/basic/table'
import { Table as SortTable } from './table/sort/table'

const data = createData(100)

export function App() {
  return (
    <div className="flex flex-col gap-4 p-2">
      <BasicTable data={data} />
      <SortTable data={data} />
    </div>
  )
}
