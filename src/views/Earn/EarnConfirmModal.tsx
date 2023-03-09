import { Text } from '@chakra-ui/react';
import { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Icon } from 'components/Atomic';
import { InfoRow } from 'components/InfoRow';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import { SaverQuoteResponse } from 'views/Earn/types';

type Props = {
  asset: AssetEntity;
  amount: Amount;
  onClose: () => void;
  isOpened: boolean;
  onConfirm: (expectedAmount: string) => void;
  tabLabel: string;
  saverQuote?: SaverQuoteResponse;
  slippage?: Amount;
  expectedOutputAmount?: Amount;
  networkFee: Amount;
  timeToBreakEvenInfo: React.ReactNode;
};

export const EarnConfirmModal = ({
  isOpened,
  onClose,
  onConfirm,
  asset,
  amount,
  tabLabel,
  saverQuote,
  slippage,
  expectedOutputAmount,
  networkFee,
  timeToBreakEvenInfo,
}: Props) => {
  const estimatedTime = useMemo(() => {
    if (!saverQuote?.outbound_delay_seconds) return undefined;
    const seconds = saverQuote.outbound_delay_seconds;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const hoursString = hours > 0 ? `${hours}h ` : '';
    const minutesString = minutes > 0 ? `${minutes % 60}m ` : '';
    const secondsString = seconds % 60 > 0 ? ` ${seconds % 60}s` : '';

    return `${hoursString}${minutesString}${secondsString}`;
  }, [saverQuote?.outbound_delay_seconds]);

  const txInfos = [
    { label: t('common.action'), value: tabLabel },
    { label: t('common.asset'), value: `${asset.name}`, icon: asset },

    { label: t('views.wallet.estimatedTime'), value: estimatedTime || 'N/A' },
    {
      label: t('views.wallet.networkFee'),
      value: `${networkFee.toSignificantWithMaxDecimals(6)} ${asset.name}`,
    },
    {
      label: t('common.slippage'),
      value: `${slippage?.toSignificantWithMaxDecimals(6) || 0} ${asset.name}`,
    },
    {
      label: tabLabel,
      value: expectedOutputAmount ? (
        `${expectedOutputAmount.toSignificantWithMaxDecimals(6)} ${asset.name}`
      ) : networkFee.gte(amount) ? (
        t('views.savings.notEnoughForOutboundFee')
      ) : (
        <Icon spin color="primary" name="loader" size={24} />
      ),
    },
    {
      label: t('views.savings.timeToBrakeEven'),
      value: timeToBreakEvenInfo,
    },
  ];

  return (
    <ConfirmModal
      buttonDisabled={!parseInt(saverQuote?.expected_amount_out || '0')}
      inputAssets={[asset]}
      isOpened={isOpened}
      onClose={onClose}
      onConfirm={() => onConfirm(expectedOutputAmount?.toSignificantWithMaxDecimals(6) || '0')}
    >
      <Box col className="mb-5">
        {txInfos.map(({ label, value, icon }) => (
          <InfoRow
            key={label}
            label={label}
            value={
              <Box center className="gap-1">
                <Text textStyle="caption">{value}</Text>
                {icon && <AssetIcon asset={icon} size={22} />}
              </Box>
            }
          />
        ))}
      </Box>
    </ConfirmModal>
  );
};
