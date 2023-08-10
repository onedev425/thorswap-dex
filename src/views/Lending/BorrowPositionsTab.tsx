import { Box, Flex, Text } from '@chakra-ui/react';
import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { Button, Icon } from 'components/Atomic';
import { ReloadButton } from 'components/ReloadButton';
import { hasConnectedWallet } from 'helpers/wallet';
import { useEffect, useMemo } from 'react';
import { t } from 'services/i18n';
import { useWallet } from 'store/wallet/hooks';
import { LoanInfoCard } from 'views/Lending/LoanInfoCard';
import { LoanInfoRow } from 'views/Lending/LoanInfoRow';
import { LendingTab, LendingViewTab } from 'views/Lending/types';
import { useLoans } from 'views/Lending/useLoans';

type Props = {
  setTab: (value: LendingTab) => void;
  setViewTab: (value: LendingViewTab) => void;
  setCollateralAsset: (value: AssetEntity) => void;
};
export const BorrowPositionsTab = ({ setTab, setViewTab, setCollateralAsset }: Props) => {
  const { wallet, setIsConnectModalOpen } = useWallet();
  const { refreshLoans, totalBorrowed, totalCollateral, loansData, isLoading } = useLoans();
  const isWalletConnected = useMemo(() => hasConnectedWallet(wallet), [wallet]);

  const setBorrowTab = () => {
    setTab(LendingTab.Borrow);
    setViewTab(LendingViewTab.Borrow);
  };

  const infoFields = [
    {
      header: t('views.lending.collateralValue'),
      value: typeof totalCollateral === 'number' ? `$${totalCollateral}` : '-',
      tooltipText: 'Fair market value of the assets used to secure a loan',
    },
    {
      header: t('views.lending.debtValue'),
      value: totalBorrowed ? `$${totalBorrowed.toFixed(2)}` : '-',
      tooltipText: 'Value of borrowed assets',
    },
  ];

  useEffect(() => {
    refreshLoans();
  }, [refreshLoans, wallet]);

  return (
    <Box alignSelf="stretch" w="full">
      {isWalletConnected ? (
        <Flex direction="column" gap={3} mt={6}>
          <Flex flex={2} justifyContent="space-between" w="full">
            <Flex alignItems="center" flex={1} justifyContent="space-between">
              <Text ml={3} mr={2} textStyle="h3">
                {t('views.lending.myLoans')}
              </Text>

              <ReloadButton loading={isLoading} onLoad={refreshLoans} size={16} />
            </Flex>
          </Flex>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            flex={2}
            gap={8}
            justifyContent="space-between"
            mt={8}
            w="full"
          >
            {infoFields.map((field) => (
              <LoanInfoCard
                header={field.header}
                key={field.header}
                tooltipText={field.tooltipText}
                value={field.value}
              />
            ))}
          </Flex>
          <Flex direction="column" justify="center" mt={8}>
            {loansData.length ? (
              loansData.map((loan) => (
                <LoanInfoRow
                  key={loan.asset.name}
                  loan={loan}
                  setBorrowTab={setBorrowTab}
                  setCollateralAsset={setCollateralAsset}
                />
              ))
            ) : (
              <Flex justify="center" w="full">
                {isLoading ? (
                  <Icon spin name="loader" size={32} />
                ) : (
                  <Text>No open loans to display</Text>
                )}
              </Flex>
            )}
          </Flex>
        </Flex>
      ) : (
        <Flex alignItems="center" alignSelf="stretch" justifyContent="center" w="full">
          <Button
            stretch
            alignSelf="center"
            maxW="460px"
            mt={3}
            onClick={() => setIsConnectModalOpen(true)}
            size="lg"
            variant="fancy"
          >
            {t('common.connectWallet')}
          </Button>
        </Flex>
      )}
    </Box>
  );
};
