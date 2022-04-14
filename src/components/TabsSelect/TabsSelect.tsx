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
            'border-light-gray-light dark:border-dark-gray-light hover:border-light-border-primary dark:hover:border-dark-gray-primary',
            'px-1 py-1 rounded-2xl border border-solid transition',
          )}
          alignCenter
        >
          <Box
            flex={1}
            flexWrap="wrap"
            justify="between"
            className="self-stretch"
          >
            {tabs.map(({ value, label }) => (
              <Button
                style={tabWidth ? { width: tabWidth } : {}}
                className={classNames('self-stretch', {
                  'flex-1': !tabWidth,
                  '!bg-opacity-100 dark:!bg-opacity-50':
                    value === selectedValue,
                })}
                key={value}
                variant={value === selectedValue ? 'primary' : 'tint'}
                type={value === selectedValue ? 'default' : 'borderless'}
                onClick={() => onChange(value)}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    )
  },
)
