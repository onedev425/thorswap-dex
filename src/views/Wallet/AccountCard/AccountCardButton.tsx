import { memo } from 'react'

import classNames from 'classnames'

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
          size="md"
          startIcon={
            <Icon
              className={classNames(
                'group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary',
                className,
              )}
              color="secondary"
              size={20}
              name={icon}
            />
          }
          variant="tint"
        />
        <Typography variant="caption">{label}</Typography>
      </Box>
    )
  },
)
