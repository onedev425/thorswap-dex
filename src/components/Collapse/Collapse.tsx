import { useCallback, useRef, useState } from 'react'

import classNames from 'classnames'

import { Card } from 'components/Card'
import { Icon } from 'components/Icon'
import { Row } from 'components/Row'
import { Typography } from 'components/Typography'

import { CollapseProps } from './types'

export const Collapse = ({
  children,
  className,
  shadow = true,
  title,
}: CollapseProps) => {
  const [active, setActive] = useState(false)

  const contentSpace = useRef<HTMLDivElement>(null)

  const toggleAccordion = useCallback(() => {
    setActive(!active)
  }, [active])

  return (
    <Card
      shadow={shadow}
      size="md"
      className={classNames('flex flex-col h-max', className)}
    >
      <div
        className="box-border w-full appearance-none cursor-pointer focus:outline-none"
        onClick={toggleAccordion}
      >
        <Row align="center" justify="between">
          {typeof title === 'string' ? (
            <Typography variant="subtitle1" color="primary" fontWeight="normal">
              {title}
            </Typography>
          ) : (
            title
          )}
          <Icon
            name="chevronDown"
            color="secondary"
            className={classNames('transform duration-300 ease inline-block', {
              '-rotate-180': active,
            })}
          />
        </Row>
      </div>

      <div
        className="overflow-auto overflow-y-hidden duration-300 ease-in-out transition-max-height"
        ref={contentSpace}
        style={{
          maxHeight: `${
            active ? contentSpace.current?.scrollHeight || 0 : 0
          }px`,
        }}
      >
        <div className="pt-4">{children}</div>
      </div>
    </Card>
  )
}
