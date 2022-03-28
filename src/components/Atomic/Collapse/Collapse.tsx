import { forwardRef, useImperativeHandle } from 'react'

import classNames from 'classnames'

import { Box, Card, Typography, Icon } from 'components/Atomic'

import { CollapseProps } from './types'
import { useCollapse } from './useCollapse'

export const maxHeightTransitionClass =
  'duration-300 ease-in-out transition-max-height overflow-auto overflow-y-hidden'

export const Collapse = forwardRef<{ toggle: () => void }, CollapseProps>(
  ({ children, className, shadow = true, title }, collapseRef) => {
    const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse()

    useImperativeHandle(collapseRef, () => ({ toggle }), [toggle])

    return (
      <Card
        className={classNames('flex flex-col h-max cursor-pointer', className)}
        shadow={shadow}
        size="md"
        onClick={toggle}
      >
        <div className="box-border w-full appearance-none focus:outline-none">
          <Box row alignCenter justify="between">
            {typeof title === 'string' ? (
              <Typography
                variant="subtitle1"
                color="primary"
                fontWeight="normal"
              >
                {title}
              </Typography>
            ) : (
              title
            )}
            <Icon
              name="chevronDown"
              color="secondary"
              className={classNames(
                'transform duration-300 ease inline-block',
                { '-rotate-180': isActive },
              )}
            />
          </Box>
        </div>

        <div
          className={maxHeightTransitionClass}
          ref={contentRef}
          style={maxHeightStyle}
        >
          <div className="pt-4">{children}</div>
        </div>
      </Card>
    )
  },
)
