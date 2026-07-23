export type Updater<T> = T | ((old: T) => T)

export function NumberRangeFilterForUnsafeValue({
  value,
  onChangeValue,
  min: limitedMin,
  max: limitedMax,
}: {
  value: unknown
  onChangeValue: (updater: Updater<unknown>) => void
  min?: number
  max?: number
}) {
  const val = value as [number, number] | undefined
  const min = val?.[0]
  const max = val?.[1]

  const handleChangeMin = (newMin: number | undefined) => {
    onChangeValue((old: [number, number] | undefined) => {
      let newMax = old?.[1]
      if (newMin !== undefined || newMax !== undefined) {
        if (limitedMin !== undefined && newMin !== undefined && newMin < limitedMin) {
          newMin = limitedMin
        }
        if (limitedMax !== undefined && newMin !== undefined && newMin > limitedMax) {
          newMin = limitedMax
        }
        if (limitedMax !== undefined && newMax !== undefined && newMax > limitedMax) {
          newMax = limitedMax
        }
        if (limitedMin !== undefined && newMax !== undefined && newMax < limitedMin) {
          newMax = limitedMin
        }
        return [newMin, newMax]
      } else {
        return undefined
      }
    })
  }

  const handleChangeMax = (newMax: number | undefined) => {
    onChangeValue((old: [number, number] | undefined) => {
      let newMin = old?.[0]
      if (newMin !== undefined || newMax !== undefined) {
        if (limitedMin !== undefined && newMin !== undefined && newMin < limitedMin) {
          newMin = limitedMin
        }
        if (limitedMax !== undefined && newMin !== undefined && newMin > limitedMax) {
          newMin = limitedMax
        }
        if (limitedMax !== undefined && newMax !== undefined && newMax > limitedMax) {
          newMax = limitedMax
        }
        if (limitedMin !== undefined && newMax !== undefined && newMax < limitedMin) {
          newMax = limitedMin
        }
        return [newMin, newMax]
      } else {
        return undefined
      }
    })
  }

  return (
    <NumberRangeFilter
      min={min}
      max={max}
      onChangeMin={handleChangeMin}
      onChangeMax={handleChangeMax}
    />
  )
}

export function NumberRangeFilter({
  min,
  max,
  onChangeMin,
  onChangeMax,
}: {
  min: number | undefined
  max: number | undefined
  onChangeMin: (value: number | undefined) => void
  onChangeMax: (value: number | undefined) => void
}) {
  const minValue = min ?? ''
  const maxValue = max ?? ''

  const handleChangeMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = e.target.value ? Number(e.target.value) : undefined
    onChangeMin(newMin)
  }

  const handleChangeMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = e.target.value ? Number(e.target.value) : undefined
    onChangeMax(newMax)
  }

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-1 pb-1">
      <input
        type="number"
        placeholder="min"
        // value に undefined を入力してしまうと、
        // Controlled コンポーネントとして動作しなくなるため、空文字として入力する
        // https://react.dev/link/controlled-components
        value={minValue}
        onChange={handleChangeMin}
        className="w-16 border border-slate-400 px-1 py-0 text-xs"
      />
      <input
        type="number"
        placeholder="max"
        value={maxValue}
        onChange={handleChangeMax}
        className="w-16 border border-slate-400 px-1 py-0 text-xs"
      />
    </div>
  )
}

export function NumberEqualsFilterForUnsafeValue({
  value,
  onChangeValue,
}: {
  value: unknown
  onChangeValue: (updater: Updater<unknown>) => void
}) {
  if (!(typeof value === 'number' || value === undefined)) {
    return <></>
  }

  return <NumberEqualsFilter value={value} onChangeValue={onChangeValue} />
}

export function NumberEqualsFilter({
  value,
  onChangeValue,
}: {
  value: number | undefined
  onChangeValue: (value: number | undefined) => void
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value ? Number(e.target.value) : undefined
    onChangeValue(newValue)
  }

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-1 pb-1">
      <input
        type="number"
        placeholder="equals"
        // value に undefined を入力してしまうと、
        // Controlled コンポーネントとして動作しなくなるため、空文字として入力する
        // https://react.dev/link/controlled-components
        value={value ?? ''}
        onChange={handleChange}
        className="w-16 border border-slate-400 px-1 py-0 text-xs"
      />
    </div>
  )
}
