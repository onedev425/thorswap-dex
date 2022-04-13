import { ReactNode } from 'react'

import classNames from 'classnames'

import { Box, Typography, Icon } from 'components/Atomic'
import { HighlightCard } from 'components/HighlightCard'
import { CardStyleType } from 'components/HighlightCard/types'

type Props = {
  className?: string
  title: string
  content: string | ReactNode
  onClose?: () => void
  type?: CardStyleType
}

export function InfoTip({
  className,
  title,
  content,
  type = 'info',
  onClose,
}: Props) {
  return (
    <HighlightCard
      className={classNames('items-center !px-2 !pt-4 !pb-2', className)}
      type={type}
    >
      <Box className="my-3" alignCenter>
        {type === 'warn' ? (
          <Icon name="warn" size={20} color="yellow" />
        ) : (
          <Icon name="bulb" size={20} />
        )}
        <Typography className="mx-2">{title}</Typography>
        {!!onClose && (
          <Icon
            name="close"
            size={20}
            color="secondary"
            className="ml-auto"
            onClick={onClose}
          />
        )}
      </Box>
      <Typography
        color={type === 'warn' ? 'yellow' : 'secondary'}
        variant="caption"
        fontWeight="semibold"
        className="px-2 py-2 brightness-90"
      >
        {content}
      </Typography>
    </HighlightCard>
  )
}
