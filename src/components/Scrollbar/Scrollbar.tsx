import Scrollbars from 'react-custom-scrollbars'

type ScrollbarProps = {
  height?: string
  children: React.ReactNode
}

export const Scrollbar = ({ height, children }: ScrollbarProps) => {
  return (
    <Scrollbars
      autoHide
      renderThumbVertical={({ style, ...scrollProps }) => (
        <div
          style={{ ...style, backgroundColor: '#00d2ff', width: '4px' }}
          {...scrollProps}
        />
      )}
      style={{ height: height || '100vh' }}
    >
      {children}
    </Scrollbars>
  )
}
