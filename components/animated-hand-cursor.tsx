'use client'

import { MousePointer2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function AnimatedHandCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const positionRef = useRef({ x: -100, y: -100 })
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      positionRef.current = { x: event.clientX, y: event.clientY }
      setIsVisible(true)

      const target = event.target instanceof Element ? event.target : null
      setIsHovering(Boolean(target?.closest('a, button, [role="button"], input, textarea, select')))

      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(() => {
          const cursor = cursorRef.current
          if (cursor) {
            cursor.style.transform = `translate3d(${positionRef.current.x + 10}px, ${positionRef.current.y + 10}px, 0)`
          }
          frameRef.current = null
        })
      }
    }

    const hideCursor = () => setIsVisible(false)

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', hideCursor)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', hideCursor)
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[9999] hidden text-primary transition-[opacity,transform] duration-150 lg:block ${isVisible ? 'opacity-100' : 'opacity-0'} ${isHovering ? 'scale-125' : 'scale-100'}`}
    >
      <MousePointer2 className="size-7 drop-shadow-md" strokeWidth={1.8} />
    </div>
  )
}
