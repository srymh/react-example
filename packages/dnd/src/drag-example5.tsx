import { useRef, useState } from 'react'

import { SnapModifier } from '@dnd-kit/abstract/modifiers'
import { Feedback } from '@dnd-kit/dom'
import { RestrictToElement } from '@dnd-kit/dom/modifiers'
import { DragDropProvider, useDraggable } from '@dnd-kit/react'

import { GraphPaper } from './graph-paper'

type Position = {
  x: number
  y: number
}

export function DragExample5() {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

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
      <div ref={containerRef} className="relative h-full w-full">
        <Draggable container={containerRef} position={position} />
        <GraphPaper />
      </div>
    </DragDropProvider>
  )
}

function Draggable({
  container,
  position,
}: {
  container: React.RefObject<HTMLDivElement | null>
  position: Position
}) {
  const { ref } = useDraggable({
    id: 'example5',
    modifiers: [
      SnapModifier.configure({ size: 32 }),
      RestrictToElement.configure({
        element: () => container.current,
      }),
    ],
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
