import { ComponentMeta } from '@storybook/react'

import SocialIcons from 'components/SocialIcons'

export default {
  title: 'Components/SocialIcons',
  component: SocialIcons,
} as ComponentMeta<typeof SocialIcons>

export const Default = () => (
  <div className="dark:bg-dark-gray-light rounded-2xl p-2.5">
    <SocialIcons />
  </div>
)
