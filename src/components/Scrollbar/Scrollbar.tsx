import Scrollbars from 'react-custom-scrollbars'

type ScrollbarProps = {
  children: React.ReactNode
  className?: string
  customStyle?: Record<string, string | number>
  height?: string
  maxHeight?: number
  minHeight?: number
}

export const Scrollbar = ({
  height,
  minHeight,
  maxHeight,
  children,
  customStyle = {},
  className,
}: ScrollbarProps) => {
  const autoHeight = !!maxHeight || !!minHeight

  return (
    <Scrollbars
      className={className}
      autoHeight={autoHeight}
      autoHeightMin={minHeight}
      autoHeightMax={maxHeight}
      autoHide
      renderThumbVertical={({ style, ...scrollProps }) => (
        <div
          style={{
            ...style,
            backgroundColor: '#00d2ff',
            width: '4px',
            ...customStyle,
          }}
          {...scrollProps}
        />
      )}
      style={autoHeight ? {} : { height: height || '100vh' }}
    >
      {children}
    </Scrollbars>
  )
}
