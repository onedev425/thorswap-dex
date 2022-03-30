import Scrollbars from 'react-custom-scrollbars'

type ScrollbarProps = {
  customStyle?: Record<string, string | number>
  children: React.ReactNode
  height?: string
  maxHeight?: number
  minHeight?: number
}

type CustomScrollbarProps = {
  autoHeightMax?: number
  autoHeightMin?: number
  autoHeight?: boolean
}

export const Scrollbar = ({
  height,
  minHeight,
  maxHeight,
  children,
  customStyle = {},
}: ScrollbarProps) => {
  const autoHeight = !!maxHeight || !!minHeight

  const customProps: CustomScrollbarProps = {}
  if (autoHeight) {
    customProps.autoHeight = true
    if (minHeight) {
      customProps.autoHeightMin = minHeight
    }

    if (maxHeight) {
      customProps.autoHeightMax = maxHeight
    }
  }

  return (
    <Scrollbars
      autoHide
      {...customProps}
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
