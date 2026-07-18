export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-72 w-full flex-nowrap gap-2 overflow-auto rounded border-4 border-slate-500 bg-slate-300 p-2">
      {children}
    </div>
  )
}
