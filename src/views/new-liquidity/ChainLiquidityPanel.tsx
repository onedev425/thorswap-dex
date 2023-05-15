import { Text } from '@chakra-ui/react';
import { FullMemberPool } from '@thorswap-lib/midgard-sdk';
import { Chain } from '@thorswap-lib/types';
import { Box, Button, Icon, Link } from 'components/Atomic';
import { InfoRow } from 'components/InfoRow';
import { chainName } from 'helpers/chainName';
import { useCallback, useMemo } from 'react';
import { t } from 'services/i18n';
import { getThorYieldLPInfoBaseRoute } from 'settings/router';
import { PoolShareType } from 'store/midgard/types';

import { LiquidityCard } from './Card';

type Props = {
  chain: Chain;
  data: FullMemberPool[];
};

export const ChainLiquidityPanel = ({ chain, data }: Props) => {
  const getShareType = useCallback(({ assetAddress, runeAddress }: FullMemberPool) => {
    if (assetAddress && runeAddress) return PoolShareType.SYM;
    if (assetAddress) return PoolShareType.ASSET_ASYM;
    if (runeAddress) return PoolShareType.RUNE_ASYM;
    return PoolShareType.SYM;
  }, []);

  const [assetAddress, runeAddress] = useMemo(() => {
    const assetAddress = data?.find(({ assetAddress }) => assetAddress)?.assetAddress;
    const runeAddress = data?.find(({ runeAddress }) => runeAddress)?.runeAddress;

    return [assetAddress, runeAddress];
  }, [data]);

  const lpLink = useMemo(
    () =>
      `${getThorYieldLPInfoBaseRoute()}}?${
        runeAddress ? `${Chain.THORChain.toLowerCase()}=${runeAddress}` : ''
      }${assetAddress ? `${chain.toLowerCase()}=${assetAddress}` : ''}`,
    [assetAddress, chain, runeAddress],
  );

  return (
    <Box col className="gap-1">
      <InfoRow
        className="!mx-1.5 pl-1.5"
        label={<Text>{chainName(chain, true)}</Text>}
        size="sm"
        value={
          <Box className="gap-x-2 mb-1">
            <Link external to={lpLink}>
              <Button
                className="px-2.5"
                leftIcon={<Icon name="chart" size={16} />}
                tooltip={t('common.viewOnThoryield')}
                variant="borderlessTint"
              />
            </Link>
          </Box>
        }
      />

      {data.map((member) => (
        <LiquidityCard {...member} withFooter key={member.pool} shareType={getShareType(member)} />
      ))}
    </Box>
  );
};
