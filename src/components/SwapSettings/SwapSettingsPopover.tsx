import { Icon } from 'components/Atomic'
import { Popover } from 'components/Popover'
import { SwapSettings } from 'components/SwapSettings'

export const SwapSettingsPopover = () => {
  return (
    <Popover trigger={<Icon color="secondary" name="cog" onClick={() => {}} />}>
      <SwapSettings />
    </Popover>
  )
}
