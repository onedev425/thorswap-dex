import classNames from 'classnames'
import { Box as RebassBox } from 'rebass'

import {
  alignClasses,
  BoxProps,
  justifyClasses,
} from 'components/Atomic/Box/types'

export const Box = ({
  className,
  children,
  col,
  center,
  alignCenter,
  justifyCenter,
  align,
  justify,
  row,
  ...rest
}: BoxProps) => {
  return (
    <RebassBox
      {...rest}
      className={classNames(
        'flex',
        {
          'flex-col': col,
          'flex-row': row,
          'items-center': alignCenter || center,
          'justify-center': justifyCenter || center,
        },
        align && alignClasses[align],
        justify && justifyClasses[justify],
        className,
      )}
    >
      {children}
    </RebassBox>
  )
}
