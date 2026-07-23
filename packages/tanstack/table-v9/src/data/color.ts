export type Color = {
  red: number
  green: number
  blue: number
  hue: number
  saturation: number
  lightness: number
}

export function createData(count: number) {
  const newData: Color[] = []

  for (let i = 0; i < count; i++) {
    const red = Math.floor(Math.random() * 256)
    const green = Math.floor(Math.random() * 256)
    const blue = Math.floor(Math.random() * 256)
    const [hue, saturation, lightness] = rgbToHsl(red, green, blue)
    newData.push({
      red,
      green,
      blue,
      hue: Math.round(hue * 360),
      saturation: Math.round(saturation * 100),
      lightness: Math.round(lightness * 100),
    })
  }

  return newData
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h: number = 0
  let s: number = 0
  const l: number = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return [h, s, l]
}
