import { Chain, ChainToChainId } from '@thorswap-lib/types';
import { gasState } from 'components/Analysis/helpers';
import { Button, Icon } from 'components/Atomic';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import { useGetGasHistoryQuery } from 'store/thorswap/api';
import { ColorType } from 'types/app';

type Props = {
  isSidebarVisible: boolean;
  inputAssetChain: Chain;
  toggleSidebar: () => void;
};
export const GasButton = ({ isSidebarVisible, inputAssetChain, toggleSidebar }: Props) => {
  const { data: gasHistoryData } = useGetGasHistoryQuery();
  const chain = inputAssetChain;

  const gasHistory = useMemo(() => {
    if (!gasHistoryData) return undefined;
    const values = gasHistoryData
      .find((item) => item && item.chainId === ChainToChainId[chain])
      ?.history.map((val) => val.value);
    const historyData = gasHistoryData.find(
      (item) => item && item.chainId === ChainToChainId[chain],
    );
    return { values, historyData };
  }, [gasHistoryData, chain]);

  const state = gasState(
    gasHistory?.values,
    gasHistory?.historyData?.average7d || gasHistory?.historyData?.average24h,
  )?.state;

  const color = gasState(
    gasHistory?.values,
    gasHistory?.historyData?.average7d || gasHistory?.historyData?.average24h,
  )?.color;

  return (
    <>
      <Button
        className="group"
        leftIcon={
          <Icon
            className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
            color={color as ColorType}
            name={isSidebarVisible ? 'gasStationOff' : 'gasStation'}
          />
        }
        onClick={toggleSidebar}
        px="2!"
        tooltip={
          isSidebarVisible
            ? t('views.swap.hideGasHistory')
            : t('views.swap.gasTooltip', {
                chain,
                state,
              })
        }
        tooltipClasses="text-center"
        tooltipPlacement="top"
        variant="borderlessTint"
      />
    </>
  );
};
