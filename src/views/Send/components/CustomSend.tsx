import { Text } from '@chakra-ui/react';
import { AssetSelect } from 'components/AssetSelect';
import { Box } from 'components/Atomic';
import { PanelInput } from 'components/PanelInput';
import { RUNEAsset } from 'helpers/assets';
import type { ChangeEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { useMidgard } from 'store/midgard/hooks';

enum MemoType {
  'deposit' = 'deposit',
  'swap' = 'swap',
}

type Props = {
  memo: string;
  setMemo: (memo: string) => void;
};

export const CustomSend = ({ memo, setMemo }: Props) => {
  const { getPoolsFromState } = useMidgard();
  const pools = getPoolsFromState();
  const [memoType] = useState(MemoType.deposit);
  const [outputAsset, setOutputAsset] = useState(RUNEAsset);

  const outputAssetsList = useMemo(() => pools.map(({ asset }) => ({ asset })), [pools]);

  const handleChangeMemo = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setMemo(value);
    },
    [setMemo],
  );

  return (
    <Box col className="self-stretch gap-1" flex={1}>
      <Box className="self-stretch px-1.5">
        <Text>{t('common.msgDeposit')}</Text>
      </Box>

      {memoType === MemoType.swap && (
        <Box alignCenter className="px-1.5" justify="between">
          <Text textStyle="caption">{t('views.send.outputAsset')}:</Text>
          <AssetSelect assets={outputAssetsList} onSelect={setOutputAsset} selected={outputAsset} />
        </Box>
      )}

      <PanelInput onChange={handleChangeMemo} title={t('common.memo')} value={memo} />
    </Box>
  );
};
