import { WalletOption } from '@thorswap-lib/multichain-sdk';
import { HoverIcon } from 'components/HoverIcon';
import { PhraseModal } from 'components/Modals/PhraseModal';
import { useState } from 'react';
import { t } from 'services/i18n';

type Props = {
  walletType: Maybe<WalletOption>;
};

export const ShowPhrase = ({ walletType }: Props) => {
  const [isPhraseModalVisible, setIsPhraseModalVisible] = useState(false);

  const handleClosePhraseModal = () => {
    setIsPhraseModalVisible(false);
  };

  if (walletType !== WalletOption.KEYSTORE) {
    return null;
  }

  return (
    <>
      <HoverIcon
        iconName="eye"
        onClick={() => setIsPhraseModalVisible(true)}
        size={16}
        tooltip={t('views.wallet.viewKeystorePhrase')}
      />
      <PhraseModal isOpen={isPhraseModalVisible} onCancel={handleClosePhraseModal} />
    </>
  );
};
