import { Asset } from '@thorswap-lib/multichain-core';
import classNames from 'classnames';
import { AssetLpIcon } from 'components/AssetIcon';
import { Box, Button, Card, Link, Typography } from 'components/Atomic';
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
            <Typography className="mr-2" variant="h4">
              THOR-RUNE LP
            </Typography>
          </Box>

          <Box className="flex-row justify-between">
            <Box col className="p-4">
              <Typography
                color="secondary"
                fontWeight="bold"
                transform="uppercase"
                variant="caption-xs"
              >
                {t('common.exchange')}
              </Typography>
              <Typography color="primary" fontWeight="bold" variant="body">
                {t('common.THORSwap')}
              </Typography>
            </Box>
            <Box col className="p-4">
              <Typography
                className="text-right"
                color="secondary"
                fontWeight="bold"
                variant="caption-xs"
              >
                {t('common.APR')}
              </Typography>

              <Typography className="text-right" color="green" fontWeight="bold" variant="body">
                {thorAPR}%
              </Typography>
            </Box>
          </Box>
          <Box className="flex-col px-4">
            <Typography>{t('views.staking.tcStakingDesc')}</Typography>
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
