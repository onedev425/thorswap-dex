import { forwardRef, useImperativeHandle } from 'react'

import classNames from 'classnames'

import { Card } from 'components/Card'
import { useCollapse } from 'components/Collapse/useCollapse'
import { Icon } from 'components/Icon'
import { Row } from 'components/Row'
import { Typography } from 'components/Typography'

import { CollapseProps } from './types'

export const Collapse = forwardRef<{ toggle: () => void }, CollapseProps>(
  ({ children, className, shadow = true, title }, collapseRef) => {
    const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse()

    useImperativeHandle(collapseRef, () => ({ toggle }), [toggle])

    return (
      <Card
        shadow={shadow}
        size="md"
        className={classNames('flex flex-col h-max', className)}
      >
        <div
          className="box-border w-full appearance-none cursor-pointer focus:outline-none"
          onClick={toggle}
        >
          <Row align="center" justify="between">
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
                {
                  '-rotate-180': isActive,
                },
              )}
            />
          </Row>
        </div>

        <div
          className="overflow-auto overflow-y-hidden duration-300 ease-in-out transition-max-height"
          ref={contentRef}
          style={maxHeightStyle}
        >
          <div className="pt-4">{children}</div>
        </div>
      </Card>
    )
  },
)
