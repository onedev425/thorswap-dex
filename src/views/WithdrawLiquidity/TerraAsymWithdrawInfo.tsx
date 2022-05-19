import { useState } from 'react'

import { Link } from 'components/Atomic'
import { InfoTip } from 'components/InfoTip'

import { t } from 'services/i18n'

const MEDIUM_URL =
  'https://medium.com/thorchain/call-to-action-for-terra-lpers-fef51496568e'

export const TerraAsymWithdrawInfo = () => {
  const [tipVisible, setTipVisible] = useState(true)

  if (!tipVisible) {
    return null
  }

  return (
    <InfoTip
      className="w-full mt-0 mb-4"
      title={t('views.liquidity.terraLPWithdraw')}
      content={
        <>
          {`${t('views.liquidity.terraLPWithdrawInfo')} `}
          <Link className="text-chain-terra" to={MEDIUM_URL}>
            {t('common.learnMore')}
          </Link>
        </>
      }
      onClose={() => setTipVisible(false)}
      type="warn"
    />
  )
}
