import { ComponentMeta } from '@storybook/react'

import { Typography } from 'components/Atomic'

import { Button } from './Button'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>

const sizes = ['sm', 'md'] as const
const variants = ['primary', 'secondary', 'tertiary', 'accent', 'tint'] as const
const customProps = [
  { key: 'outline', type: 'outline' },
  { key: 'borderless', type: 'borderless' },
  { key: 'disabled', disabled: true },
] as const

export const All = () => {
  return (
    <div className="flex flex-col p-4 space-y-2 bg-light-bg-primary dark:bg-dark-bg-primary">
      {sizes.map((size) => (
        <div key={size}>
          <Typography>Size: "{size}"</Typography>
          {variants.map((variant) => (
            <div key={variant} className="flex my-2">
              <div className="flex space-x-2">
                <Button size={size} variant={variant} transform="capitalize">
                  {variant}
                </Button>

                {customProps.map(({ key, ...restProps }) => (
                  <Button
                    {...restProps}
                    key={key}
                    size={size}
                    variant={variant}
                    transform="capitalize"
                  >
                    {key}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
