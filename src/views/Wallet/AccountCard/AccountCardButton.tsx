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
      <Box col center className="group gap-y-2">
        <Button
          className="!w-12 px-0"
          variant="tint"
          size="md"
          startIcon={
            <Icon
              className={classNames(
                'group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary min-w-[20px]',
                className,
              )}
              color="secondary"
              size={20}
              name={icon}
            />
          }
          onClick={onClick}
        />
        <Typography
          className={'group-hover:text-white'}
          variant="caption"
          fontWeight="medium"
          color="secondary"
        >
          {label}
        </Typography>
      </Box>
    )
  },
)
