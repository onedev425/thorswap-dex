import { useCallback, useRef, useState, useLayoutEffect } from 'react'

const collapseClasses = 'ease-in-out transition-all'

export const useCollapse = (defaultExpanded = false) => {
  const [isActive, setIsActive] = useState(defaultExpanded)
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

  const maxHeightActive = maxHeight ? `${maxHeight}px` : 'unset'
  const maxHeightStyle = {
    maxHeight: isActive ? maxHeightActive : '0px',
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
