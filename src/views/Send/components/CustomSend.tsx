import { Asset } from '@thorswap-lib/multichain-core';
import { AssetSelect } from 'components/AssetSelect';
import { Box, Typography } from 'components/Atomic';
import { PanelInput } from 'components/PanelInput';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
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
  const { getInboundData, pools } = useMidgard();
  const [memoType] = useState(MemoType.deposit);
  const [outputAsset, setOutputAsset] = useState<Asset>(Asset.RUNE());

  const outputAssetsList = useMemo(() => {
    return pools.map((p) => ({
      asset: p.asset,
    }));
  }, [pools]);

  useEffect(() => {
    getInboundData();
  }, [getInboundData]);

  const handleChangeMemo = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setMemo(value);
    },
    [setMemo],
  );

  return (
    <Box col className="self-stretch gap-1" flex={1}>
      <Box className="self-stretch px-1.5">
        <Typography>{t('common.msgDeposit')}</Typography>
      </Box>

      {memoType === MemoType.swap && (
        <Box alignCenter className="px-1.5" justify="between">
          <Typography variant="caption">{t('views.send.outputAsset')}:</Typography>
          <AssetSelect assets={outputAssetsList} onSelect={setOutputAsset} selected={outputAsset} />
        </Box>
      )}

      <PanelInput onChange={handleChangeMemo} title={t('common.memo')} value={memo} />
    </Box>
  );
};
