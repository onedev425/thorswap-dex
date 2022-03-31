import { memo } from 'react'

import { Box, Tooltip, Typography } from 'components/Atomic'

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

      <Tooltip iconName="info" content={tooltip} />
    </Box>
  )
})
