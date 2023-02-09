import { Text } from '@chakra-ui/react';
import { Amount, Asset } from '@thorswap-lib/multichain-core';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Icon } from 'components/Atomic';
import { ChainBadge } from 'components/ChainBadge';
import { InfoRow } from 'components/InfoRow';
import { shortenAddress } from 'helpers/shortenAddress';
import { memo } from 'react';
import { t } from 'services/i18n';

type Props = {
  inputAsset: Asset;
  recipient: string;
  amount: Amount;
  feeLabel: string;
};

export const ConfirmContent = memo(({ inputAsset, recipient, feeLabel, amount }: Props) => {
  return (
    <Box col>
      <Box center flex={1}>
        <Text textStyle="subtitle2">
          {t('common.upgradeChainRune', { chain: inputAsset.chain })}
        </Text>
      </Box>

      <Box alignCenter row justify="between">
        <Box center col className="flex-1 p-4 rounded-2xl">
          <AssetIcon asset={inputAsset} />
          <Box center className="pt-2">
            <ChainBadge asset={inputAsset} />
          </Box>
          <Box center className="w-full">
            <Text fontWeight="medium" textStyle="caption">
              {amount.toSignificantWithMaxDecimals(6)} {inputAsset.ticker}
            </Text>
          </Box>
        </Box>

        <Icon className="mx-2 -rotate-90" name="arrowDown" />
        <Box center col className="flex-1 p-4 rounded-2xl">
          <AssetIcon asset={Asset.RUNE()} />
          <Box center className="pt-2">
            <ChainBadge asset={Asset.RUNE()} />
          </Box>
          <Box center className="w-full">
            <Text fontWeight="medium" textStyle="caption">
              {amount.toSignificantWithMaxDecimals(6)} {Asset.RUNE().ticker}
            </Text>
          </Box>
        </Box>
      </Box>

      <Box
        col
        className="p-4 border border-solid rounded-2xl border-light-border-primary dark:border-dark-border-primary"
      >
        <InfoRow label={t('common.recipient')} value={shortenAddress(recipient)} />
        <InfoRow label={t('common.transactionFee')} showBorder={false} value={feeLabel} />
      </Box>
    </Box>
  );
});
