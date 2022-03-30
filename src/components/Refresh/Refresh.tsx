import { useCallback, useState } from 'react'

import { Button, Icon } from 'components/Atomic'

import { t } from 'services/i18n'

export type RefreshProps = {
  onRefresh: () => void
}

export const Refresh = ({ onRefresh }: RefreshProps): JSX.Element => {
  const [loading, setLoading] = useState(false)

  const handleRefresh = useCallback(() => {
    setLoading(true)
    onRefresh()
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [onRefresh])

  return (
    <Button
      className="px-2.5"
      type="borderless"
      variant="tint"
      onClick={handleRefresh}
      startIcon={<Icon name="refresh" size={20} spin={loading} />}
      tooltip={t('common.refresh')}
    />
  )
}
