import { DragExample1 } from './drag-example1'
import { DragExample2 } from './drag-example2'
import { DragExample3 } from './drag-example3'
import { DragExample4 } from './drag-example4'
import { DragExample5 } from './drag-example5'

export function App() {
  return (
    <>
      <div
        style={
          {
            '--sh-grid-col': 'repeat(4, 256px)',
            '--sh-grid-row': 'repeat(4, 256px)',
          } as React.CSSProperties
        }
        className="m-8 grid h-max w-max grid-cols-(--sh-grid-col) grid-rows-(--sh-grid-row)"
      >
        <DragExample1 />
        <DragExample2 />
        <DragExample3 />
        <DragExample4 />
        <DragExample5 />
      </div>
    </>
  )
}
