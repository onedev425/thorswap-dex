import { ReactNode, useCallback, useMemo } from 'react'

import Scrollbars from 'react-custom-scrollbars-2'

import { useTheme } from '../Theme/ThemeContext'

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
  const { isLight } = useTheme()
  const useAutoHeight = !!maxHeight || !!minHeight || autoHeight

  const renderThumbnail = useCallback(
    ({ style }: { style: Record<string, string> }) => (
      <div
        className={scrollClassName}
        style={{
          ...style,
          borderRadius: '4px',
          backgroundColor: isLight ? '#afb6cc' : '#29354a',
          width: '4px',
        }}
      />
    ),
    [isLight, scrollClassName],
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
