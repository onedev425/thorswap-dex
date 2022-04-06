import Scrollbars from 'react-custom-scrollbars'

type ScrollbarProps = {
  children: React.ReactNode
  className?: string
  customStyle?: Record<string, string | number>
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
  customStyle = {},
  className,
  autoHeight,
}: ScrollbarProps) => {
  const useAutoHeight = !!maxHeight || !!minHeight || autoHeight

  return (
    <Scrollbars
      className={className}
      autoHeight={useAutoHeight}
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
      style={useAutoHeight ? {} : { height: height || '100vh' }}
    >
      {children}
    </Scrollbars>
  )
}
