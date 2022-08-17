import { memo } from 'react'

import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon'
import { AssetInputType } from 'components/AssetInput/types'
import { Box, Icon, Typography } from 'components/Atomic'
import { ChainBadge } from 'components/ChainBadge'

import { t } from 'services/i18n'

import { shortenAddress } from 'helpers/shortenAddress'

type Props = {
  inputAsset: AssetInputType
  outputAsset: AssetInputType
  recipient: string
  estimatedTime: string
  slippageInfo: string
  minReceive: string
  totalFee: string
  affiliateFee: string
  feeAssets: string
}

export const ConfirmContent = memo(
  ({
    inputAsset,
    outputAsset,
    recipient,
    estimatedTime,
    slippageInfo,
    minReceive,
    totalFee,
    affiliateFee,
    feeAssets,
  }: Props) => {
    return (
      <Box col>
        <Box row alignCenter justify="between">
          <Box className="flex-1 p-4 rounded-2xl" center col>
            <AssetIcon asset={inputAsset.asset} />
            <Box className="pt-2" center>
              <ChainBadge asset={inputAsset.asset} />
            </Box>
            <Box className="w-full" center>
              <Typography variant="caption" fontWeight="medium">
                {inputAsset.value?.toSignificant(6)} {inputAsset.asset.ticker}
              </Typography>
            </Box>
          </Box>

          <Icon className="mx-2 -rotate-90" name="arrowDown" />
          <Box className="flex-1 p-4 rounded-2xl" center col>
            <AssetIcon asset={outputAsset.asset} />
            <Box className="pt-2" center>
              <ChainBadge asset={outputAsset.asset} />
            </Box>
            <Box className="w-full" center>
              <Typography variant="caption" fontWeight="medium">
                {outputAsset.value?.toSignificant(6)} {outputAsset.asset.ticker}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          className="w-full py-4 border border-solid rounded-2xl border-light-border-primary dark:border-dark-border-primary"
          col
        >
          <Box className="w-full" row>
            <Box className="flex-1 gap-y-2" center col>
              <Typography
                variant="caption"
                color="secondary"
                fontWeight="medium"
              >
                {t('common.estimateTime')}
              </Typography>
              <Typography variant="caption">{estimatedTime}</Typography>
            </Box>
            <Box className="flex-1 gap-y-2" center col>
              <Typography
                variant="caption"
                color="secondary"
                fontWeight="medium"
              >
                {t('common.fee')}
              </Typography>
              <Typography variant="caption">{totalFee}</Typography>
            </Box>
            <Box className="flex-1 gap-y-2" center col>
              <Typography
                variant="caption"
                color="secondary"
                fontWeight="medium"
              >
                {t('common.slippage')}
              </Typography>
              <Typography variant="caption">{slippageInfo}</Typography>
            </Box>
          </Box>

          <Box className="px-4">
            <Box className="w-full h-[1px] bg-light-border-primary dark:bg-dark-border-primary my-2" />
          </Box>

          <Box className="w-full py-2" row>
            <Box className="flex-1 gap-y-2" center col>
              <Typography
                variant="caption"
                color="secondary"
                fontWeight="medium"
              >
                {t('views.swap.exchangeFee')}
              </Typography>

              <Typography
                className={classNames({
                  'line-through': affiliateFee === '$0.00',
                })}
                variant="caption"
              >
                {affiliateFee === '$0.00' ? 'FREE' : affiliateFee}
              </Typography>
            </Box>

            <Box className="flex-1 gap-y-2" center col>
              <Typography
                variant="caption"
                color="secondary"
                fontWeight="medium"
              >
                {t('common.recipient')}
              </Typography>
              <Typography variant="caption">
                {shortenAddress(recipient)}
              </Typography>
            </Box>

            <Box className="flex-1 gap-y-2" center col>
              <Typography
                variant="caption"
                color="secondary"
                fontWeight="medium"
              >
                {t('views.swap.txAssetsFee')}
              </Typography>
              <Typography variant="caption">{feeAssets}</Typography>
            </Box>
          </Box>

          <Box className="px-4">
            <Box className="w-full h-[1px] bg-light-border-primary dark:bg-dark-border-primary my-2" />
          </Box>

          <Box className="w-full" row>
            <Box className="flex-1 gap-y-2" center col>
              <Typography
                variant="caption"
                color="secondary"
                fontWeight="medium"
              >
                {t('common.minReceived')}
              </Typography>
              <Typography variant="caption">{minReceive}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  },
)
