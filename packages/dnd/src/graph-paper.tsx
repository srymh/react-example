export function GraphPaper() {
  return (
    <svg
      className="pointer-events-none absolute top-0 left-0 -z-50 h-full w-full"
      width="100%"
      height="100%"
    >
      <defs>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="gray" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  )
}
