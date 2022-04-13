import { Tab } from '@headlessui/react'
import classNames from 'classnames'

import { Box, Typography } from 'components/Atomic'
import { TabsConfig } from 'components/Atomic/Tabs/types'

type Props = {
  tabs: TabsConfig
}

export const Tabs = ({ tabs }: Props) => {
  return (
    <Box className="w-full" col>
      <Tab.Group>
        <Tab.List className="flex p-1 space-x-1 bg-light-secondary dark:bg-dark-secondary rounded-2xl border border-solid !border-opacity-40 border-dark-gray-primary">
          {tabs.map((t) => (
            <Tab
              key={t.label}
              className={({ selected }) =>
                classNames(
                  'w-full py-1.5 rounded-xl focus:outline-none focus:ring-0 border-none cursor-pointer',
                  selected
                    ? 'bg-liggh-bg-secondary dark:bg-gray'
                    : 'bg-transparent',
                )
              }
            >
              <Typography>{t.label}</Typography>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {tabs.map((t) => (
            <Tab.Panel key={t.label}>{t.panel}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </Box>
  )
}
