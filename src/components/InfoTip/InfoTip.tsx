import { ReactNode } from 'react'

import classNames from 'classnames'

import { Box, Typography, Icon } from 'components/Atomic'
import { HighlightCard } from 'components/HighlightCard'
import { cardFontColors, CardStyleType } from 'components/HighlightCard/types'

type Props = {
  className?: string
  title?: string
  content?: string | ReactNode
  children?: ReactNode
  onClose?: () => void
  type?: CardStyleType
}

const icons: Record<CardStyleType, ReactNode> = {
  primary: <Icon name="bulb" size={20} />,
  warn: <Icon name="warn" size={20} color="yellow" />,
  info: <Icon name="infoCircle" size={20} color="primaryBtn" />,
  success: <Icon name="infoCircle" size={20} color="green" />,
}

export const InfoTip = ({
  className,
  children,
  title,
  content,
  type = 'primary',
  onClose,
}: Props) => {
  return (
    <HighlightCard
      className={classNames(
        'self-stretch items-center !px-2 !pb-2',
        title || onClose ? '!pt-4' : '!pt-2',
        className,
      )}
      type={type}
    >
      {(!!title || !!onClose) && (
        <Box className="self-stretch px-2" alignCenter justify="between">
          {!!title && (
            <Box>
              {icons[type]}

              <Typography className="mx-2">{title}</Typography>
            </Box>
          )}

          {onClose && (
            <Icon
              name="close"
              size={20}
              color="secondary"
              className="ml-auto"
              onClick={onClose}
            />
          )}
        </Box>
      )}

      {children || (
        <Typography
          color={cardFontColors[type]}
          variant="caption"
          fontWeight="semibold"
          className="px-2 py-2 brightness-90"
        >
          {content}
        </Typography>
      )}
    </HighlightCard>
  )
}
