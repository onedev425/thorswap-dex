import { memo } from 'react'

import { Box, Icon, Tooltip, Typography } from 'components/Atomic'
import { baseTextHoverClass } from 'components/constants'

type Props = {
  value: string
  tooltip: string
}

export const InfoWithTooltip = memo(({ value, tooltip }: Props) => {
  return (
    <Box alignCenter className="gap-x-2">
      <Typography
        className="text-right"
        variant="caption"
        fontWeight="semibold"
        color="primary"
      >
        {value}
      </Typography>

      <Tooltip content={tooltip}>
        <Icon
          className={baseTextHoverClass}
          name="infoCircle"
          color="secondary"
          size={20}
        />
      </Tooltip>
    </Box>
  )
})
