import { memo } from 'react'

import { Amount, Asset } from '@thorswap-lib/multichain-sdk'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Icon, Typography } from 'components/Atomic'
import { ChainBadge } from 'components/ChainBadge'
import { InfoRow } from 'components/InfoRow'

import { t } from 'services/i18n'

import { shortenAddress } from 'helpers/shortenAddress'

type Props = {
  inputAsset: Asset
  recipient: string
  amount: Amount
  feeLabel: string
}

export const ConfirmContent = memo(
  ({ inputAsset, recipient, feeLabel, amount }: Props) => {
    return (
      <Box col>
        <Box flex={1} center>
          <Typography variant="subtitle2">
            {t('common.upgradeChainRune', { chain: inputAsset.chain })}
          </Typography>
        </Box>

        <Box row alignCenter justify="between">
          <Box className="flex-1 p-4 rounded-2xl" center col>
            <AssetIcon asset={inputAsset} />
            <Box className="pt-2" center>
              <ChainBadge asset={inputAsset} />
            </Box>
            <Box className="w-full" center>
              <Typography variant="caption" fontWeight="medium">
                {amount.toSignificant(6)} {inputAsset.ticker}
              </Typography>
            </Box>
          </Box>

          <Icon className="mx-2 -rotate-90" name="arrowDown" />
          <Box className="flex-1 p-4 rounded-2xl" center col>
            <AssetIcon asset={Asset.RUNE()} />
            <Box className="pt-2" center>
              <ChainBadge asset={Asset.RUNE()} />
            </Box>
            <Box className="w-full" center>
              <Typography variant="caption" fontWeight="medium">
                {amount.toSignificant(6)} {Asset.RUNE().ticker}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          className="p-4 border border-solid rounded-2xl border-light-border-primary dark:border-dark-border-primary"
          col
        >
          <InfoRow
            label={t('common.recipient')}
            value={shortenAddress(recipient)}
          ></InfoRow>
          <InfoRow
            label={t('common.transactionFee')}
            value={feeLabel}
            showBorder={false}
          ></InfoRow>
        </Box>
      </Box>
    )
  },
)
