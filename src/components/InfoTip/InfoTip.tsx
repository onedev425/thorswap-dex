import classNames from 'classnames'

import { Box, Typography, Icon } from 'components/Atomic'

type Props = {
  className?: string
  title: string
  content: string
  onClose?: () => void
}

export function InfoTip({ className, title, content, onClose }: Props) {
  return (
    <div className={classNames('items-center mx-4 md:mx-12 my-4', className)}>
      <Box className="my-3" alignCenter>
        <Icon name="bulb" size={20} />
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
        variant="caption"
        fontWeight="semibold"
        className="!text-dark-gray-primary px-2 py-2"
      >
        {content}
      </Typography>
    </div>
  )
}
