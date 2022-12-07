import { Asset } from '@thorswap-lib/multichain-core';
import { AssetSelectButton } from 'components/AssetSelect/AssetSelectButton';
import { AssetSelectList } from 'components/AssetSelect/AssetSelectList';
import { TokenListProviderSelect } from 'components/AssetSelect/TokenListProviderSelect';
import { AssetSelectProps } from 'components/AssetSelect/types';
import { Box, Modal } from 'components/Atomic';
import { useState } from 'react';
import { t } from 'services/i18n';

type Props = {
  selected?: Asset | null;
  className?: string;
  showAssetType?: boolean;
  AssetListComponent?: (props: AssetSelectProps) => JSX.Element;
} & AssetSelectProps;

export const AssetSelect = ({
  selected,
  className,
  showAssetType,
  AssetListComponent,
  ...restProps
}: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  const [manageTokenListIsOpened, setManageTokenListIsOpened] = useState(false);

  const ListComponent = AssetListComponent || AssetSelectList;

  return (
    <>
      <AssetSelectButton
        className={className}
        onClick={() => {
          setIsOpened(true);
          setManageTokenListIsOpened(false);
        }}
        selected={selected}
        showAssetType={showAssetType}
      />

      <Modal
        isOpened={isOpened}
        onBack={manageTokenListIsOpened ? () => setManageTokenListIsOpened(false) : undefined}
        onClose={() => setIsOpened(false)}
        title={t(
          manageTokenListIsOpened
            ? 'components.assetSelect.manageTokenList'
            : 'components.assetSelect.selectAToken',
        )}
        withBody={false}
      >
        <Box className="w-[95vw] md:w-[520px] overflow-hidden max-h-[80%] h-[80vh] lg:h-[40rem]">
          {manageTokenListIsOpened ? (
            <TokenListProviderSelect {...restProps} />
          ) : (
            <ListComponent
              {...restProps}
              onClose={() => setIsOpened(false)}
              openManageTokenList={() => setManageTokenListIsOpened(true)}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};
