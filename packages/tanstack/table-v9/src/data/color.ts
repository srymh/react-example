export type Color = {
  red: number
  green: number
  blue: number
}

export function createData(count: number) {
  const newData: Color[] = []

  for (let i = 0; i < count; i++) {
    newData.push({
      red: Math.floor(Math.random() * 256),
      green: Math.floor(Math.random() * 256),
      blue: Math.floor(Math.random() * 256),
    })
  }

  return newData
}
