import { Text } from '@chakra-ui/react';
import type { Amount, AssetAmount, AssetEntity } from '@thorswap-lib/swapkit-core';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Icon } from 'components/Atomic';
import { InfoRow } from 'components/InfoRow';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { useMemo } from 'react';
import { t } from 'services/i18n';

type Props = {
  asset: AssetEntity;
  amount: Amount;
  onClose: () => void;
  isOpened: boolean;
  onConfirm: (expectedAmount: string) => void;
  tabLabel: string;
  outboundDelay?: number;
  slippage?: Amount;
  expectedOutputAmount?: Amount;
  expectedAmountOut?: string;
  networkFee: AssetAmount;
  timeToBreakEvenInfo: React.ReactNode;
};

export const EarnConfirmModal = ({
  isOpened,
  onClose,
  onConfirm,
  asset,
  amount,
  tabLabel,
  outboundDelay,
  expectedAmountOut,
  slippage,
  expectedOutputAmount,
  networkFee,
  timeToBreakEvenInfo,
}: Props) => {
  const estimatedTime = useMemo(() => {
    if (!outboundDelay) return undefined;
    const minutes = Math.floor(outboundDelay / 60);
    const hours = Math.floor(minutes / 60);
    const hoursString = hours > 0 ? `${hours}h ` : '';
    const minutesString = minutes > 0 ? `${minutes % 60}m ` : '';
    const secondsString = outboundDelay % 60 > 0 ? ` ${outboundDelay % 60}s` : '';

    return `${hoursString}${minutesString}${secondsString}`;
  }, [outboundDelay]);

  const txInfos = [
    { label: t('common.action'), value: tabLabel },
    { label: t('common.asset'), value: `${asset.name}`, icon: asset },

    { label: t('views.wallet.estimatedTime'), value: estimatedTime || 'N/A' },
    {
      label: t('views.wallet.networkFee'),
      value: `${networkFee.toSignificant(6)} ${networkFee.asset.name}`,
    },
    {
      label: t('common.slippage'),
      value: `${slippage?.toSignificant(6) || 0} ${asset.name}`,
    },
    {
      label: tabLabel,
      value: expectedOutputAmount ? (
        `${expectedOutputAmount.toSignificant(6)} ${asset.name}`
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
      buttonDisabled={!parseInt(expectedAmountOut || '0')}
      inputAssets={[asset]}
      isOpened={isOpened}
      onClose={onClose}
      onConfirm={() => onConfirm(expectedOutputAmount?.toSignificant(6) || '0')}
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
