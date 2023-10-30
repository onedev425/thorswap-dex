import { useCallback } from 'react';
import { useGetLastblockQuery } from 'store/midgard/api';

const TC_BLOCK_TIME = 6000; // 6 seconds avg

export function useTCBlockTimer() {
  const { data: lastBlock } = useGetLastblockQuery();
  const tcLastBlock = lastBlock?.[0]?.thorchain;

  const getBlockTimeDifference = useCallback(
    (blockHeight: number) => {
      const blocksDiff = blockHeight - (tcLastBlock || 0);
      return blocksDiff * TC_BLOCK_TIME;
    },
    [tcLastBlock],
  );

  const estimateTimeFromBlocks = useCallback((blocksCount: number) => {
    return blocksCount * TC_BLOCK_TIME;
  }, []);

  return { getBlockTimeDifference, estimateTimeFromBlocks };
}
