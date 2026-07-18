import type { Color } from '../data/color'

export function ColorCell({ red, green, blue }: Color) {
  const style = {
    backgroundColor: `rgb(${red}, ${green}, ${blue})`,
  }

  return <div className="h-4 w-full" style={style} />
}
