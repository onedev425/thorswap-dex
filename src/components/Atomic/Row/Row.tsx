import classNames from 'classnames'
import { Box } from 'rebass'

import { Props, bgClasses, alignClasses, justifyClasses } from './types'

export const Row = (props: Props) => {
  const {
    className,
    align = 'center',
    justify = 'start',
    background,
    children,
    ...rest
  } = props

  return (
    <Box
      className={classNames(
        className,
        'flex',
        alignClasses[align],
        justifyClasses[justify],
        background ? bgClasses[background] : '',
      )}
      {...rest}
    >
      {children}
    </Box>
  )
}
