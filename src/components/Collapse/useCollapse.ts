import { useCallback, useRef, useState } from 'react'

export const useCollapse = () => {
  const [isActive, setIsActive] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)

  const toggle = useCallback(() => {
    setIsActive((v) => !v)
  }, [])

  const maxHeight = contentRef.current?.scrollHeight || 0

  const maxHeightStyle = {
    maxHeight: `${isActive ? maxHeight : 0}px`,
  }

  return { contentRef, toggle, isActive, maxHeight, maxHeightStyle }
}
