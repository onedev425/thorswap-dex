import { memo } from 'react'

import classNames from 'classnames'

import { Box, Button, Typography } from 'components/Atomic'
import { TabSelectType } from 'components/TabsSelect/types'

type Props = {
  title?: string
  titleWidth?: string
  tabs: TabSelectType[]
  tabWidth?: string
  value: string
  onChange: (val: string) => void
}

export const TabsSelect = memo(
  ({
    title,
    titleWidth,
    tabs,
    tabWidth,
    value: selectedValue,
    onChange,
  }: Props) => {
    return (
      <Box flex={1} alignCenter>
        {!!title && (
          <Box style={titleWidth ? { width: titleWidth } : {}}>
            <Typography className="px-2" variant="caption" color="secondary">
              {title}
            </Typography>
          </Box>
        )}

        <Box
          row
          flex={1}
          className={classNames(
            'border-light-gray-light dark:border-dark-gray-light hover:border-light-gray-primary dark:hover:border-dark-gray-primary',
            'px-2 py-1 rounded-2xl border border-solid transition',
          )}
          alignCenter
        >
          <Box flex={1} flexWrap="wrap" className="self-stretch gap-1">
            {tabs.map(({ value, label }) => (
              <Button
                style={tabWidth ? { width: tabWidth } : {}}
                className={classNames('self-stretch', {
                  '!bg-opacity-50': value === selectedValue,
                  'flex-1': !tabWidth,
                })}
                key={value}
                variant={value === selectedValue ? 'primary' : 'tint'}
                type={value === selectedValue ? 'default' : 'borderless'}
                onClick={() => onChange(value)}
              >
                <Typography variant="caption-xs">{label}</Typography>
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    )
  },
)
