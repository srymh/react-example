export function Button({
  children,
  className: _,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="border border-slate-400 bg-slate-600 px-1 py-0 text-xs text-white shadow-md hover:bg-slate-500 active:translate-y-0.5 active:shadow-sm disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-slate-200"
      {...rest}
    >
      {children}
    </button>
  )
}
