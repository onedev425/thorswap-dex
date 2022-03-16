import Scrollbars from 'react-custom-scrollbars'

type ScrollbarProps = {
  customStyle?: Record<string, string | number>
  height?: string
  children: React.ReactNode
}

export const Scrollbar = ({
  height,
  children,
  customStyle = {},
}: ScrollbarProps) => {
  return (
    <Scrollbars
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
      style={{ height: height || '100vh' }}
    >
      {children}
    </Scrollbars>
  )
}
