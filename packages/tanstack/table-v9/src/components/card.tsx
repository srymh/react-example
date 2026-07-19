export function Card({
  children,
  title,
  description,
}: {
  children: React.ReactNode
  title?: string
  description?: string
}) {
  return (
    <div className="flex h-100 w-full flex-col flex-nowrap gap-2 rounded border-4 border-slate-500 bg-slate-300 p-2">
      <div className="flex h-max shrink-0 flex-col items-start justify-center">
        {title && <h2 className="font-bold">{title}</h2>}
        {description && (
          <p className="line-clamp-3 max-h-16 overflow-hidden text-xs text-gray-600">
            {description}
          </p>
        )}
      </div>
      <div className="flex min-h-0 w-full flex-1 flex-nowrap gap-2 overflow-auto">{children}</div>
    </div>
  )
}
