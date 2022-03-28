import { useCallback, useRef, useState, useLayoutEffect } from 'react'

const collapseClasses = 'duration-300 ease-in-out transition-max-height'

export const useCollapse = () => {
  const [isActive, setIsActive] = useState(false)
  const maxHeightRef = useRef(0)
  const [maxHeight, setMaxHeight] = useState(0)

  const contentRef = useRef<HTMLDivElement>(null)

  const toggle = useCallback(() => {
    setIsActive((v) => !v)
  }, [])

  const expand = useCallback(() => {
    setIsActive(true)
  }, [])

  const collapse = useCallback(() => {
    setIsActive(false)
  }, [])

  const measure = useCallback(() => {
    const height = contentRef.current?.scrollHeight || 0
    if (height !== maxHeightRef.current) {
      maxHeightRef.current = height
      setMaxHeight(height)
    }
  }, [])

  useLayoutEffect(() => {
    measure()
  })

  const maxHeightStyle = {
    maxHeight: `${isActive ? maxHeight : 0}px`,
    overflow: 'hidden',
  }

  return {
    contentRef,
    isActive,
    toggle,
    expand,
    collapse,
    maxHeight,
    maxHeightStyle,
    collapseClasses,
  }
}
