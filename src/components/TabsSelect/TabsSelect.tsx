import classNames from 'classnames'

import { Box, Button, Typography } from 'components/Atomic'
import { TabSelectType } from 'components/TabsSelect/types'

type Props = {
  tabs: TabSelectType[]
  value: string
  onChange: (val: string) => void
}

export const TabsSelect = ({ tabs, value, onChange }: Props) => {
  return (
    <Box
      className="!flex-row flex-1 !px-2 !py-1 !gap-1 rounded-2xl bg-light-gray-light dark:bg-dark-gray-light"
      disabled
    >
      {tabs.map((tab) => (
        <Button
          className={classNames('flex-1', {
            '!bg-opacity-50': tab.value === value,
          })}
          key={tab.value}
          variant={tab.value === value ? 'primary' : 'tint'}
          type={tab.value === value ? 'default' : 'borderless'}
          onClick={() => onChange(tab.value)}
        >
          <Typography variant="caption-xs">{tab.label}</Typography>
        </Button>
      ))}
    </Box>
  )
}
