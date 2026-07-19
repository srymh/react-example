import { useState } from 'react'

import { ChevronsDownUpIcon, ChevronsUpDownIcon } from 'lucide-react'

export function Card({
  children,
  title,
  description,
}: {
  children: React.ReactNode
  title?: string
  description?: string
}) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div
      className={
        'relative flex w-full flex-col flex-nowrap gap-2 rounded border-4 border-slate-500 bg-slate-300 p-2' +
        (isOpen ? ' h-100' : ' h-max')
      }
    >
      <div className="flex h-max shrink-0 flex-col items-start justify-center">
        {title && <h2 className="font-bold">{title}</h2>}
        {description && (
          <p className="line-clamp-3 max-h-16 overflow-hidden text-xs text-gray-600">
            {description}
          </p>
        )}
        <button
          className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded border border-slate-400 bg-slate-200 text-slate-600 hover:bg-slate-300"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <ChevronsUpDownIcon /> : <ChevronsDownUpIcon />}
        </button>
      </div>
      {isOpen && (
        <div className="flex min-h-0 w-full flex-1 flex-nowrap gap-2 overflow-auto">{children}</div>
      )}
    </div>
  )
}
