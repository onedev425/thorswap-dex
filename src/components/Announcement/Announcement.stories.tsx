import { ComponentMeta } from '@storybook/react'

import { AnnouncementType } from 'store/externalConfig/types'

import { Announcement } from './Announcement'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Announcement',
  component: Announcement,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Announcement>

export const All = () => {
  return (
    <div className="flex flex-col space-y-2 bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <Announcement
        announcement={{
          type: AnnouncementType.Info,
          title: '$THOR staking',
          message: 'Staking is live',
        }}
      />
    </div>
  )
}
