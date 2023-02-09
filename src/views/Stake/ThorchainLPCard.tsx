import { Text } from '@chakra-ui/react';
import { Asset } from '@thorswap-lib/multichain-core';
import classNames from 'classnames';
import { AssetLpIcon } from 'components/AssetIcon';
import { Box, Button, Card, Link } from 'components/Atomic';
import { borderHoverHighlightClass } from 'components/constants';
import { useThorAPR } from 'hooks/useThorAPR';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import { getAddLiquidityRoute, getWithdrawRoute } from 'settings/router';
import { useWallet } from 'store/wallet/hooks';

import { tcFarmData } from './farmData';

export const ThorchainLPCard = () => {
  const { wallet, setIsConnectModalOpen } = useWallet();
  const thorAPR = useThorAPR();
  const liquidityRouter = getAddLiquidityRoute(Asset.THOR());
  const withdrawRouter = getWithdrawRoute(Asset.THOR());

  const ethAddr = useMemo(() => wallet?.ETH?.address, [wallet]);

  return (
    <Box col className="flex-1 !min-w-[360px] lg:!max-w-[50%]">
      <Box className="w-full h-full min-h-[436px] relative mt-14">
        <Card className={classNames('flex-col flex-1', borderHoverHighlightClass)}>
          <div className="flex justify-center absolute m-auto left-0 right-0 top-[-28px]">
            <AssetLpIcon
              hasShadow
              inline
              asset1={tcFarmData.assets[0]}
              asset2={tcFarmData.assets[1]}
              size="big"
            />
          </div>

          <Box center className="mt-8">
            <Text className="mr-2" textStyle="h4">
              THOR-RUNE LP
            </Text>
          </Box>

          <Box className="flex-row justify-between">
            <Box col className="p-4">
              <Text
                fontWeight="bold"
                textStyle="caption-xs"
                textTransform="uppercase"
                variant="secondary"
              >
                {t('common.exchange')}
              </Text>
              <Text fontWeight="bold" textStyle="body" variant="primary">
                {t('common.THORSwap')}
              </Text>
            </Box>
            <Box col className="p-4">
              <Text
                className="text-right"
                fontWeight="bold"
                textStyle="caption-xs"
                variant="secondary"
              >
                {t('common.APR')}
              </Text>

              <Text className="text-right" fontWeight="bold" textStyle="body" variant="green">
                {thorAPR}%
              </Text>
            </Box>
          </Box>
          <Box className="flex-col px-4">
            <Text>{t('views.staking.tcStakingDesc')}</Text>
          </Box>
          <Box alignCenter className="flex-col-reverse flex-grow w-full mt-4">
            {!ethAddr ? (
              <Button stretch onClick={() => setIsConnectModalOpen(true)} size="lg" variant="fancy">
                {t('common.connectWallet')}
              </Button>
            ) : (
              <Box alignCenter row className="self-stretch gap-2">
                <Link className="flex-1" to={liquidityRouter}>
                  <Button stretch variant="primary">
                    {t('common.deposit')}
                  </Button>
                </Link>
                <Link className="flex-1" to={withdrawRouter}>
                  <Button stretch variant="secondary">
                    {t('common.withdraw')}
                  </Button>
                </Link>
              </Box>
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
};
