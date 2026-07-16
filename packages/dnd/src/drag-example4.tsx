import { useState } from 'react'

import { SnapModifier } from '@dnd-kit/abstract/modifiers'
import { Feedback } from '@dnd-kit/dom'
import { DragDropProvider, useDraggable } from '@dnd-kit/react'

import { GraphPaper } from './graph-paper'

type Position = {
  x: number
  y: number
}

export function DragExample4() {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })

  return (
    <DragDropProvider
      onDragEnd={({ operation, canceled }) => {
        if (canceled) {
          return
        }

        const { x, y } = operation.transform

        setPosition((position) => ({
          x: position.x + x,
          y: position.y + y,
        }))
      }}
    >
      <div className="relative h-full w-full">
        <Draggable position={position} />
        <GraphPaper />
      </div>
    </DragDropProvider>
  )
}

function Draggable({ position }: { position: Position }) {
  const { ref } = useDraggable({
    id: 'example4',
    modifiers: [SnapModifier.configure({ size: 32 })],
    plugins: [Feedback.configure({ feedback: 'clone' })],
  })

  return (
    <div
      ref={ref}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      className="flex size-32 cursor-grab items-center justify-center rounded-lg bg-blue-500 text-white active:cursor-grabbing data-[dnd-placeholder=clone]:opacity-50"
    >
      Drag me
    </div>
  )
}
