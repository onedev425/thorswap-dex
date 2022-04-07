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

export const TabsSelect = ({
  title,
  titleWidth,
  tabs,
  tabWidth,
  value,
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
        className="!flex-row flex-1 !px-2 !py-1 !gap-1 rounded-2xl border border-solid border-light-gray-light dark:border-dark-gray-light hover:border-light-gray-primary dark:hover:border-dark-gray-primary transition"
        disabled
        alignCenter
      >
        <Box className="self-stretch flex-1 !gap-1">
          {tabs.map((tab) => (
            <Button
              style={tabWidth ? { width: tabWidth } : {}}
              className={classNames('self-stretch', {
                '!bg-opacity-50': tab.value === value,
                'flex-1': !tabWidth,
              })}
              key={tab.value}
              variant={tab.value === value ? 'primary' : 'tint'}
              onClick={() => onChange(tab.value)}
            >
              <Typography variant="caption-xs">{tab.label}</Typography>
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
