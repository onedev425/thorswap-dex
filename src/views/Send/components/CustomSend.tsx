import { Asset, Memo } from '@thorswap-lib/multichain-core';
import { AssetSelect } from 'components/AssetSelect';
import { Box, Typography } from 'components/Atomic';
import { PanelInput } from 'components/PanelInput';
import { TabsSelect } from 'components/TabsSelect';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { useMidgard } from 'store/midgard/hooks';

enum MemoType {
  'deposit' = 'deposit',
  'swap' = 'swap',
}

type Props = {
  sendAsset: Asset | null;
  memo: string;
  poolAddress: string;
  setMemo: (memo: string) => void;
  setPoolAddress: (memo: string) => void;
};

export const CustomSend = ({ sendAsset, poolAddress, memo, setPoolAddress, setMemo }: Props) => {
  const { inboundAddresses, getInboundData, pools } = useMidgard();
  const [memoType, setMemoType] = useState(MemoType.deposit);
  const [outputAsset, setOutputAsset] = useState<Asset>(Asset.RUNE());

  const outputAssetsList = useMemo(() => {
    return pools.map((p) => ({
      asset: p.asset,
    }));
  }, [pools]);

  useEffect(() => {
    getInboundData();
  }, [getInboundData]);

  const updatePoolAddress = useCallback(() => {
    const poolAddress = sendAsset?.L1Chain ? inboundAddresses[sendAsset.L1Chain] : '';
    setPoolAddress(poolAddress || '');
  }, [inboundAddresses, sendAsset?.L1Chain, setPoolAddress]);

  const udpateMemo = useCallback(() => {
    let memo = '';
    if (memoType === MemoType.deposit) {
      if (sendAsset) {
        memo = Memo.depositMemo(sendAsset);
      }
    } else {
      const address = multichain().getWalletAddressByChain(outputAsset?.L1Chain);
      memo = Memo.swapMemo(outputAsset, address || '');
    }
    setMemo(memo);
  }, [memoType, outputAsset, sendAsset, setMemo]);

  useEffect(() => {
    udpateMemo();
  }, [udpateMemo]);

  useEffect(() => {
    updatePoolAddress();
  }, [updatePoolAddress]);

  const tabs = useMemo(
    () => [
      { label: 'Deposit', value: MemoType.deposit },
      { label: 'Swap', value: MemoType.swap },
    ],
    [],
  );

  const handleChangeRecipient = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setPoolAddress(value);
    },
    [setPoolAddress],
  );

  const handleChangeMemo = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setMemo(value);
    },
    [setMemo],
  );

  return (
    <Box col className="self-stretch gap-1" flex={1}>
      <Box className="self-stretch">
        <TabsSelect onChange={(val) => setMemoType(val as MemoType)} tabs={tabs} value={memoType} />
      </Box>

      {memoType === MemoType.swap && (
        <Box alignCenter className="px-1.5" justify="between">
          <Typography variant="caption">{t('views.send.outputAsset')}:</Typography>
          <AssetSelect assets={outputAssetsList} onSelect={setOutputAsset} selected={outputAsset} />
        </Box>
      )}

      <PanelInput
        onChange={handleChangeRecipient}
        placeholder="Pool Address"
        title="Pool Address"
        value={poolAddress}
      />

      <PanelInput onChange={handleChangeMemo} title={t('common.memo')} value={memo} />
    </Box>
  );
};
