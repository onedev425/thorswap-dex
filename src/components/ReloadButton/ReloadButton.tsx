import { Button, Icon } from 'components/Atomic'

export type ReloadProps = {
  loading: boolean
  onLoad: () => void
  tooltip?: string
}

export const ReloadButton = ({
  loading,
  onLoad,
  tooltip = 'Reload',
}: ReloadProps): JSX.Element => {
  return (
    <Button
      className="px-2.5"
      type="borderless"
      variant="tint"
      onClick={onLoad}
      startIcon={<Icon name="refresh" size={20} spin={loading} />}
      tooltip={tooltip}
    />
  )
}
