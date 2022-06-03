import { ReactNode, useCallback, useMemo } from 'react'

import Scrollbars from 'react-custom-scrollbars-2'

type ScrollbarProps = {
  children: ReactNode
  scrollClassName?: string
  className?: string
  height?: string
  maxHeight?: number | string
  minHeight?: number | string
  autoHeight?: boolean
}

export const Scrollbar = ({
  height,
  minHeight,
  maxHeight,
  children,
  className,
  autoHeight,
  scrollClassName,
}: ScrollbarProps) => {
  const useAutoHeight = !!maxHeight || !!minHeight || autoHeight

  const renderThumbnail = useCallback(
    (scrollProps: ToDo) => (
      <div
        {...scrollProps}
        className={scrollClassName}
        style={{
          ...scrollProps.style,
          backgroundColor: '#00d2ff',
          width: '4px',
        }}
      />
    ),
    [scrollClassName],
  )

  const style = useMemo(
    () => (useAutoHeight ? {} : { height: height || '100vh' }),
    [height, useAutoHeight],
  )

  return (
    <Scrollbars
      className={className}
      autoHeight={useAutoHeight}
      autoHeightMin={minHeight}
      autoHeightMax={maxHeight}
      autoHide
      renderThumbVertical={renderThumbnail}
      style={style}
    >
      {children}
    </Scrollbars>
  )
}
