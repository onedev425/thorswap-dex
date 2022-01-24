import classNames from 'classnames'
import { Box } from 'rebass'

import { bgClasses, borderClasses } from 'components/Button/types'

import { alignClasses, justifyClasses, Props } from './types'

export const Row = (props: Props) => {
  const {
    className,
    align = 'center',
    justify = 'start',
    background,
    borderColor,
    children,
    ...rest
  } = props

  return (
    <Box
      className={classNames(
        className,
        'flex border-solid',
        borderColor ? 'border' : '',
        alignClasses[align],
        justifyClasses[justify],
        background ? bgClasses[background] : '',
        borderColor ? borderClasses[borderColor] : '',
      )}
      {...rest}
    >
      {children}
    </Box>
  )
}
