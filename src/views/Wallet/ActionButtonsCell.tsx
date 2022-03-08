import { useNavigate } from 'react-router-dom'

import { Box, Button } from 'components/Atomic'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

type Props = {
  asset: string
}

export const ActionButtonsCell = ({ asset }: Props) => {
  const navigate = useNavigate()

  const handleSendPress = () => {
    navigate(`${ROUTES.Send}?asset=${asset}`)
  }

  return (
    <Box className="gap-2" justify="end">
      <Button onClick={handleSendPress} variant="tertiary" type="outline">
        {t('common.send')}
      </Button>

      <Button type="outline">{t('common.receive')}</Button>

      <Button variant="secondary" type="outline">
        {t('common.swap')}
      </Button>
    </Box>
  )
}
