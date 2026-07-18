export function Button({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      className="border border-slate-400 bg-slate-600 px-1 py-0 text-xs text-white shadow-md hover:bg-slate-500 active:translate-y-0.5 active:shadow-sm"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
