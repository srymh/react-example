import { TableHeaderCell } from '../../components/table'

export function TableHeaderCellWithFilter({
  children,
  renderFilter,
  canFilter,
}: {
  children: React.ReactNode
  renderFilter?: React.ReactNode
  canFilter?: boolean
}) {
  return (
    <TableHeaderCell>
      <div className="flex h-full w-full flex-col items-center justify-center py-0.5">
        {children}
        {canFilter && renderFilter}
      </div>
    </TableHeaderCell>
  )
}
