import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import { AssetInputType } from 'components/AssetInput/types';
import { Box, Icon, Typography } from 'components/Atomic';
import { ChainBadge } from 'components/ChainBadge';
import { shortenAddress } from 'helpers/shortenAddress';
import { memo } from 'react';
import { t } from 'services/i18n';

type Props = {
  inputAsset: AssetInputType;
  outputAsset: AssetInputType;
  recipient: string;
  estimatedTime: string;
  slippageInfo: string;
  minReceive: string;
  totalFee: string;
  affiliateFee: string;
  feeAssets: string;
};

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
        <Box alignCenter row justify="between">
          <Box center col className="flex-1 p-4 rounded-2xl">
            <AssetIcon asset={inputAsset.asset} />
            <Box center className="pt-2">
              <ChainBadge asset={inputAsset.asset} />
            </Box>
            <Box center className="w-full">
              <Typography fontWeight="medium" variant="caption">
                {inputAsset.value?.toSignificantWithMaxDecimals(6)} {inputAsset.asset.ticker}
              </Typography>
            </Box>
          </Box>

          <Icon className="mx-2 -rotate-90" name="arrowDown" />
          <Box center col className="flex-1 p-4 rounded-2xl">
            <AssetIcon asset={outputAsset.asset} />
            <Box center className="pt-2">
              <ChainBadge asset={outputAsset.asset} />
            </Box>
            <Box center className="w-full">
              <Typography fontWeight="medium" variant="caption">
                {outputAsset.value?.toSignificantWithMaxDecimals(6)} {outputAsset.asset.ticker}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          col
          className="w-full py-4 border border-solid rounded-2xl border-light-border-primary dark:border-dark-border-primary"
        >
          <Box row className="w-full">
            <Box center col className="flex-1 gap-y-2">
              <Typography color="secondary" fontWeight="medium" variant="caption">
                {t('common.estimateTime')}
              </Typography>
              <Typography variant="caption">{estimatedTime}</Typography>
            </Box>
            <Box center col className="flex-1 gap-y-2">
              <Typography color="secondary" fontWeight="medium" variant="caption">
                {t('common.fee')}
              </Typography>
              <Typography variant="caption">{totalFee}</Typography>
            </Box>
            <Box center col className="flex-1 gap-y-2">
              <Typography color="secondary" fontWeight="medium" variant="caption">
                {t('common.slippage')}
              </Typography>
              <Typography variant="caption">{slippageInfo}</Typography>
            </Box>
          </Box>

          <Box className="px-4">
            <Box className="w-full h-[1px] bg-light-border-primary dark:bg-dark-border-primary my-2" />
          </Box>

          <Box row className="w-full py-2">
            <Box center col className="flex-1 gap-y-2">
              <Typography color="secondary" fontWeight="medium" variant="caption">
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

            <Box center col className="flex-1 gap-y-2">
              <Typography color="secondary" fontWeight="medium" variant="caption">
                {t('common.recipient')}
              </Typography>
              <Typography variant="caption">{shortenAddress(recipient)}</Typography>
            </Box>

            <Box center col className="flex-1 gap-y-2">
              <Typography color="secondary" fontWeight="medium" variant="caption">
                {t('views.swap.txAssetsFee')}
              </Typography>
              <Typography variant="caption">{feeAssets}</Typography>
            </Box>
          </Box>

          <Box className="px-4">
            <Box className="w-full h-[1px] bg-light-border-primary dark:bg-dark-border-primary my-2" />
          </Box>

          <Box row className="w-full">
            <Box center col className="flex-1 gap-y-2">
              <Typography color="secondary" fontWeight="medium" variant="caption">
                {t('common.minReceived')}
              </Typography>
              <Typography variant="caption">{minReceive}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  },
);
