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

export function categorizeHue(hue: number) {
  // 色相である程度分ける. 赤っぽい色、青っぽい色など
  if (hue < 15 || hue >= 345) return 'Red'
  if (hue < 45) return 'Orange'
  if (hue < 70) return 'Yellow'
  if (hue < 165) return 'Green'
  if (hue < 195) return 'Cyan'
  if (hue < 255) return 'Blue'
  if (hue < 345) return 'Purple'
  return 'Red'
}

export const rgbToHex = (r: number, g: number, b: number) =>
  `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
