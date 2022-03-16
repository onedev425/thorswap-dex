import { memo } from 'react'

import { Box, Button, Icon, IconName, Typography } from 'components/Atomic'

type Props = {
  label: string
  onClick: () => void
  icon: IconName
  className?: string
}

export const AccountCardButton = memo(
  ({ className, label, onClick, icon }: Props) => {
    return (
      <Box col center className="gap-y-2">
        <Button
          onClick={onClick}
          type="outline"
          startIcon={
            <Icon
              className={className}
              color="secondary"
              size={20}
              name={icon}
            />
          }
          variant="tint"
          className="!h-12 px-4 rounded-box"
        />
        <Typography variant="caption">{label}</Typography>
      </Box>
    )
  },
)
