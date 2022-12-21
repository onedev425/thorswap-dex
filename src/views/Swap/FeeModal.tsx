import { Asset, QuoteRoute } from '@thorswap-lib/multichain-core';
import { SupportedChain } from '@thorswap-lib/types';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Modal, Typography } from 'components/Atomic';
import { InfoRowConfig } from 'components/InfoRow/types';
import { InfoTable } from 'components/InfoTable';
import { chainToSigAsset } from 'helpers/assets';
import { useFormatPrice } from 'helpers/formatPrice';
import { memo, useEffect, useMemo } from 'react';
import { t } from 'services/i18n';

type Fees = ReturnType<QuoteRoute['fees']['get']>;
type Props = {
  isOpened: boolean;
  onClose: () => void;
  fees?: QuoteRoute['fees'];
  totalFee: string;
};

export const FeeModal = memo(({ totalFee, fees, isOpened, onClose }: Props) => {
  const formatPrice = useFormatPrice();
  const rows: InfoRowConfig[] = useMemo(() => {
    if (!fees) return [];

    const { affiliateFee, ...chainsFees } = Object.entries(fees).reduce(
      (acc, fee) => {
        const [chain, value] = fee as [SupportedChain, Fees];

        if (value) {
          value?.forEach((a) => (acc.affiliateFee += a.affiliateFeeUSD));

          acc[chain] = value;
        }

        return acc;
      },
      { affiliateFee: 0 } as { affiliateFee: number } & {
        [key in SupportedChain]: Fees;
      },
    );

    const rows = Object.entries(chainsFees).reduce((acc, [chain, fee]) => {
      if (!fee) return acc;

      const chainFees = fee.map(({ type, networkFee, networkFeeUSD, asset }) => {
        const chainAsset = chainToSigAsset(chain as SupportedChain);
        const feeAsset = Asset.fromAssetString(asset);

        return {
          label: (
            <Box center className="gap-x-1">
              <Typography variant="caption">
                {`${t('common.network')} `}
                {type ? t(`common.${type}`) : ''}
              </Typography>
              <AssetIcon asset={chainAsset} size={20} />
            </Box>
          ),
          value: (
            <Box center className="gap-x-1">
              {feeAsset && (
                <>
                  <Typography color="secondary" variant="caption-xs">
                    (
                  </Typography>
                  <AssetIcon asset={feeAsset} size={14} />
                  <Typography color="secondary" variant="caption-xs">
                    {formatPrice(networkFee, { prefix: '' })})
                  </Typography>
                </>
              )}
              <Typography>{formatPrice(networkFeeUSD)}</Typography>
            </Box>
          ),
        };
      });

      return [...chainFees, ...acc];
    }, [] as InfoRowConfig[]);

    return [
      ...rows,
      {
        label: (
          <Box center className="gap-x-1">
            <Typography variant="caption">{t('views.swap.exchangeFee')}</Typography>
            <AssetIcon asset={Asset.THOR()} hasChainIcon={false} size={20} />
          </Box>
        ),
        value:
          affiliateFee > 0 ? (
            formatPrice(affiliateFee)
          ) : (
            <Typography color="green">FREE</Typography>
          ),
      },
      {
        label: (
          <Box center>
            <Typography variant="caption">{t('views.wallet.totalFee')}</Typography>
          </Box>
        ),
        value: <Typography>{totalFee}</Typography>,
      },
    ];
  }, [fees, formatPrice, totalFee]);

  useEffect(() => {
    if (!fees && isOpened) {
      onClose();
    }
  }, [fees, isOpened, onClose]);

  if (!fees) return null;

  return (
    <Modal isOpened={isOpened} onClose={onClose} title={t('views.swap.feeExplanation')}>
      <Box className="w-80" flex={1}>
        <InfoTable items={rows} />
      </Box>
    </Modal>
  );
});
