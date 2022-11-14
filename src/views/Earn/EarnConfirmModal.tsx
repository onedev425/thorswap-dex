import {
  Amount,
  AmountType,
  Asset,
  MULTICHAIN_DECIMAL,
  Percent,
} from '@thorswap-lib/multichain-core';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Icon, Typography } from 'components/Atomic';
import { InfoRow } from 'components/InfoRow';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { getSaverQuote } from 'store/midgard/actions';
import { useMidgard } from 'store/midgard/hooks';
import { useWallet } from 'store/wallet/hooks';

type Props = {
  asset: Asset;
  amount: Amount;
  assetDepthAmount: Amount;
  isDeposit: boolean;
  onClose: () => void;
  isOpened: boolean;
  onConfirm: () => void;
  tabLabel: string;
  withdrawPercent: Percent;
};

type SaverQuoteResponse = {
  expected_amount_out: string;
  fees: { affiliate: string; asset: string; outbound: string };
};

export const EarnConfirmModal = ({
  isOpened,
  onClose,
  onConfirm,
  asset,
  amount,
  isDeposit,
  tabLabel,
  assetDepthAmount,
  withdrawPercent,
}: Props) => {
  const { wallet } = useWallet();
  const address = wallet?.[asset.L1Chain]?.address || '';
  const [saverQuote, setSaverQuoteData] = useState<SaverQuoteResponse>();
  const { outboundFee } = useMidgard();
  const { slippage, networkFee } = useMemo(
    () => ({
      slippage: amount.div(amount.add(assetDepthAmount).mul(amount)),
      networkFee: new Amount(
        parseInt(outboundFee[asset.L1Chain] || '0') * (isDeposit ? 1 / 3 : 1),
        AmountType.BASE_AMOUNT,
        MULTICHAIN_DECIMAL,
      ),
    }),
    [amount, asset.L1Chain, assetDepthAmount, isDeposit, outboundFee],
  );

  const getConfirmData = useCallback(async () => {
    if (isOpened) {
      const quoteParams = isDeposit
        ? {
            type: 'deposit' as const,
            amount: `${Math.floor(amount.assetAmount.toNumber() * 10 ** MULTICHAIN_DECIMAL)}`,
          }
        : {
            address,
            type: 'withdraw' as const,
            withdraw_bps: `${parseInt(withdrawPercent.toSignificant()) * 100}`,
          };

      const response = (await getSaverQuote({
        ...quoteParams,
        asset: asset.toString().toLowerCase(),
      })) as SaverQuoteResponse;

      setSaverQuoteData(response);
    }
  }, [address, amount.assetAmount, asset, isDeposit, isOpened, withdrawPercent]);

  useEffect(() => {
    if (isOpened) {
      getConfirmData();
    }
  }, [getConfirmData, isOpened]);

  const txInfos = [
    { label: t('common.action'), value: tabLabel },
    { label: t('common.asset'), value: `${asset.name}`, icon: asset },
    { label: t('common.amount'), value: `${amount.toSignificant(6)} ${asset.name}` },
    { label: t('views.wallet.networkFee'), value: `${networkFee.toSignificant(6)} ${asset.name}` },
    { label: t('common.slippage'), value: `${slippage.toSignificant(6)} ${asset.name}` },
    {
      label: tabLabel,
      value: saverQuote?.expected_amount_out ? (
        `${new Amount(
          saverQuote.expected_amount_out,
          AmountType.BASE_AMOUNT,
          MULTICHAIN_DECIMAL,
        ).toSignificant(6)} ${asset.name}`
      ) : networkFee.gte(amount) ? (
        'Not enough amount to cover outbound fee'
      ) : (
        <Icon spin color="primary" name="loader" size={24} />
      ),
    },
  ];

  return (
    <ConfirmModal
      buttonDisabled={!parseInt(saverQuote?.expected_amount_out || '0')}
      inputAssets={[asset]}
      isOpened={isOpened}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      {txInfos.map((info) => (
        <InfoRow
          key={info.label}
          label={info.label}
          value={
            <Box center className="gap-1">
              <Typography variant="caption">{info.value}</Typography>
              {info.icon && <AssetIcon asset={info.icon} size={22} />}
            </Box>
          }
        />
      ))}
    </ConfirmModal>
  );
};
