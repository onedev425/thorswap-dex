import { Button, Icon } from 'components/Atomic'

export type ReloadProps = {
  loading: boolean
  onLoad: () => void
  tooltip?: string
  size?: number
}

export const ReloadButton = ({
  loading,
  onLoad,
  tooltip = 'Reload',
  size = 20,
}: ReloadProps): JSX.Element => {
  return (
    <Button
      className="px-2.5"
      type="borderless"
      variant="tint"
      onClick={onLoad}
      startIcon={<Icon name="refresh" size={size} spin={loading} />}
      tooltip={tooltip}
    />
  )
}
