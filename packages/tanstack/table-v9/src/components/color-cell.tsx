import { rgbToHex } from '../data/color'
import type { Color } from '../data/color'

export function ColorCell({ red, green, blue, quiet = true }: Color & { quiet?: boolean }) {
  const style = {
    backgroundColor: `rgb(${red}, ${green}, ${blue})`,
  }

  const textStrokeClassName =
    '[text-shadow:-1px_-1px_0_white,0_-1px_0_white,1px_-1px_0_white,-1px_0_0_white,1px_0_0_white,-1px_1px_0_white,0_1px_0_white,1px_1px_0_white]'

  return (
    <div
      // 文字を白で縁取りするために、text-shadow を使用する。
      className={'h-4 w-full truncate px-2 font-mono text-xs ' + textStrokeClassName}
      style={style}
    >
      {!quiet && rgbToHex(red, green, blue)}
    </div>
  )
}

export function RedCell({ red, quiet = false }: { red: number; quiet?: boolean }) {
  if (quiet) {
    return <>{red}</>
  }

  return <ColorCellBase label={`${red}`} bgColor={`rgb(${red}, 0, 0)`} />
}

export function GreenCell({ green, quiet = false }: { green: number; quiet?: boolean }) {
  if (quiet) {
    return <>{green}</>
  }

  return <ColorCellBase label={`${green}`} bgColor={`rgb(0, ${green}, 0)`} />
}

export function BlueCell({ blue, quiet = false }: { blue: number; quiet?: boolean }) {
  if (quiet) {
    return <>{blue}</>
  }

  return <ColorCellBase label={`${blue}`} bgColor={`rgb(0, 0, ${blue})`} />
}

function ColorCellBase({ label, bgColor }: { label: string; bgColor: string }) {
  return (
    <div className="grid w-full min-w-max grid-cols-2 items-center gap-1 truncate">
      <div className="flex justify-end">{label}</div>
      <div className="h-2 w-full rounded-full" style={{ backgroundColor: bgColor }}></div>
    </div>
  )
}
