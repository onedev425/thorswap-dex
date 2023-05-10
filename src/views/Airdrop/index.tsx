import { Box, Button } from 'components/Atomic';
import { InfoRow } from 'components/InfoRow';
import { PanelView } from 'components/PanelView';
import { TabsSelect } from 'components/TabsSelect';
import { ViewHeader } from 'components/ViewHeader';
import { t } from 'services/i18n';
import { useVthorUtil } from 'views/StakeVThor/useVthorUtil';

import { useAirdrop } from './hooks';
import { airdropTabs, AirdropType } from './types';

const Airdrop = () => {
  const {
    isWhitelisted,
    handleClaim,
    isClaiming,
    airdropAmount,
    isFetchingMerkleProof,
    isFetchingWhitelisted,
    ethAddr,
    airdropAction,
    setAirdropAction,
    setIsConnectModalOpen,
  } = useAirdrop();

  const { getRate } = useVthorUtil();

  return (
    <PanelView
      header={<ViewHeader title={t('views.airdrop.airdrop')} />}
      title={t('views.airdrop.airdrop')}
    >
      <Box className="self-stretch">
        <TabsSelect
          onChange={(val: string) => {
            setAirdropAction(val as AirdropType);
          }}
          tabs={airdropTabs}
          value={airdropAction}
        />
      </Box>
      <Box col className="w-full p-2 pt-0">
        <InfoRow label={t('views.airdrop.claimableAmount')} value={`${airdropAmount} THOR`} />
        {airdropAction === AirdropType.CLAIM_AND_STAKE && (
          <>
            <InfoRow label={t('views.airdrop.vTHORRatio')} value={`${getRate(true).toFixed(2)}`} />
            <InfoRow
              label={t('views.airdrop.vTHORAfterStaking')}
              value={`${(airdropAmount * getRate()).toFixed(2)} vTHOR`}
            />
          </>
        )}
        {!ethAddr ? (
          <Button
            stretch
            className="mt-4"
            onClick={() => setIsConnectModalOpen(true)}
            size="lg"
            variant="fancy"
          >
            {t('common.connectWallet')}
          </Button>
        ) : (
          <Button
            stretch
            className="mt-4"
            disabled={!isWhitelisted}
            loading={isClaiming || isFetchingMerkleProof || isFetchingWhitelisted}
            onClick={handleClaim}
            size="lg"
            variant="fancy"
          >
            {airdropAction === AirdropType.CLAIM
              ? t('views.airdrop.claim')
              : t('views.airdrop.claimAndStake')}
          </Button>
        )}
      </Box>
    </PanelView>
  );
};

export default Airdrop;
