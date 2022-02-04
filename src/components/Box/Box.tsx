import classNames from 'classnames'
import { Box as RebassBox } from 'rebass'

import { alignClasses, BoxProps, justifyClasses } from 'components/Box/types'

export const Box = ({
  className,
  children,
  col,
  center,
  alignCenter,
  justifyCenter,
  align,
  justify,
  ...rest
}: BoxProps) => {
  return (
    <RebassBox
      className={classNames(
        'flex',
        {
          'flex-col': col,
          'items-center': alignCenter || center,
          'justify-center': justifyCenter || center,
        },
        align && alignClasses[align],
        justify && justifyClasses[justify],
        className,
      )}
      {...rest}
    >
      {children}
    </RebassBox>
  )
}
