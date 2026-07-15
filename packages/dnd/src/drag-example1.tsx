import { DragDropProvider, useDraggable } from '@dnd-kit/react'

import { GraphPaper } from './graph-paper'

export function DragExample1() {
  return (
    <DragDropProvider>
      <div className="relative h-full w-full">
        <Draggable />
        <GraphPaper />
      </div>
    </DragDropProvider>
  )
}

function Draggable() {
  const { ref } = useDraggable({
    id: 'example1',
  })

  return (
    <div
      ref={ref}
      className="flex size-32 cursor-grab items-center justify-center rounded-lg bg-blue-500 text-white active:cursor-grabbing"
    >
      Drag me
    </div>
  )
}
