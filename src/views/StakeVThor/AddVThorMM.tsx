import { stakingV2Addr, vThorInfo } from 'views/StakeVThor/utils'

import { Button, Icon } from 'components/Atomic'

import { t } from 'services/i18n'

import { NETWORK } from 'settings/config'

export const AddVThorMM = () => {
  const addVTHOR = async () => {
    const vThorAddress = stakingV2Addr.VTHOR[NETWORK]

    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: vThorAddress,
            symbol: vThorInfo.ticker,
            decimals: vThorInfo.decimals,
            image: vThorInfo.iconUrl,
          },
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Button
      transform="none"
      variant="tint"
      type="outline"
      endIcon={<Icon name="metamask" size={16} />}
      onClick={addVTHOR}
    >
      {t('views.stakingVThor.addVTHOR')}
    </Button>
  )
}
