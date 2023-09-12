import { Flex, Text } from '@chakra-ui/react';
import { hexlify } from '@ethersproject/bytes';
import { toUtf8Bytes } from '@ethersproject/strings';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import type { AssetInputType } from 'components/AssetInput/types';
import { Box, Icon, Tooltip } from 'components/Atomic';
import { ChainBadge } from 'components/ChainBadge';
import { InfoTip } from 'components/InfoTip';
import { shortenAddress } from 'helpers/shortenAddress';
import { memo, useMemo } from 'react';
import { t } from 'services/i18n';

type Props = {
  inputAsset: AssetInputType;
  outputAsset: AssetInputType;
  recipient: string;
  estimatedTime: string;
  slippageInfo: string;
  minReceive: string;
  totalFee: string;
  affiliateFee: string;
  feeAssets: string;
  swapMemo: string;
  streamSwap: boolean;
  showSmallSwapWarning: boolean;
};

export const ConfirmContent = memo(
  ({
    inputAsset,
    outputAsset,
    recipient,
    estimatedTime,
    slippageInfo,
    minReceive,
    totalFee,
    streamSwap,
    affiliateFee,
    feeAssets,
    swapMemo,
    showSmallSwapWarning,
  }: Props) => {
    const memoHex = useMemo(() => hexlify(toUtf8Bytes(swapMemo)), [swapMemo]);

    return (
      <>
        {streamSwap && (
          <Flex
            _groupHover={{ bgColor: 'transparent' }}
            align="center"
            bgColor="brand.btnSecondary"
            borderRadius="xl"
            h={4}
            justify="center"
            position="absolute"
            px={4}
            right={-3}
            top={8}
            transform="rotate(48deg)"
            w={24}
          >
            <Text
              _groupHover={{ color: 'white' }}
              fontSize="12px"
              fontWeight={500}
              lineHeight="16px"
            >
              Beta
            </Text>
          </Flex>
        )}

        <Box col>
          <Box alignCenter row justify="between">
            <Box center col className="flex-1 p-4 rounded-2xl">
              <AssetIcon asset={inputAsset.asset} />
              <Box center className="pt-2">
                <ChainBadge asset={inputAsset.asset} />
              </Box>
              <Box center className="w-full">
                <Text fontWeight="medium" textStyle="caption">
                  {inputAsset.value?.toSignificant(6)} {inputAsset.asset.ticker}
                </Text>
              </Box>
            </Box>

            <Icon className="mx-2 -rotate-90" name="arrowDown" />
            <Box center col className="flex-1 p-4 rounded-2xl">
              <AssetIcon asset={outputAsset.asset} />
              <Box center className="pt-2">
                <ChainBadge asset={outputAsset.asset} />
              </Box>
              <Box center className="w-full">
                <Text fontWeight="medium" textStyle="caption">
                  {outputAsset.value?.toSignificant(6)} {outputAsset.asset.ticker}
                </Text>
              </Box>
            </Box>
          </Box>

          <Box
            col
            className="w-full py-4 border border-solid rounded-2xl border-light-border-primary dark:border-dark-border-primary"
          >
            <Box row className="w-full">
              <Box center col className="flex-1 gap-y-2">
                <Text fontWeight="medium" textStyle="caption" variant="secondary">
                  {t('common.estimateTime')}
                </Text>
                <Text textStyle="caption">{estimatedTime}</Text>
              </Box>
              <Box center col className="flex-1 gap-y-2">
                <Text fontWeight="medium" textStyle="caption" variant="secondary">
                  {t('common.fee')}
                </Text>
                <Text textStyle="caption">{totalFee}</Text>
              </Box>
              <Box center col className="flex-1 gap-y-2">
                <Text fontWeight="medium" textStyle="caption" variant="secondary">
                  {t('common.slippage')}
                </Text>
                <Text textStyle="caption">{slippageInfo}</Text>
              </Box>
            </Box>

            <Box className="px-4">
              <Box className="w-full h-[1px] bg-light-border-primary dark:bg-dark-border-primary my-2" />
            </Box>

            <Box row className="w-full py-2">
              <Box center col className="flex-1 gap-y-2">
                <Text fontWeight="medium" textStyle="caption" variant="secondary">
                  {t('views.swap.exchangeFee')}
                </Text>

                <Text
                  className={classNames({
                    'line-through': affiliateFee === '$0.00',
                  })}
                  textStyle="caption"
                >
                  {affiliateFee === '$0.00' ? 'FREE' : affiliateFee}
                </Text>
              </Box>

              <Box center col className="flex-1 gap-y-2">
                <Text fontWeight="medium" textStyle="caption" variant="secondary">
                  {t('common.recipient')}
                </Text>
                <Text textStyle="caption">{shortenAddress(recipient)}</Text>
              </Box>

              <Box center col className="flex-1 gap-y-2">
                <Text fontWeight="medium" textStyle="caption" variant="secondary">
                  {t('views.swap.txAssetsFee')}
                </Text>
                <Text textStyle="caption">{feeAssets}</Text>
              </Box>
            </Box>

            {swapMemo?.length > 0 && (
              <>
                <Box className="px-4">
                  <Box className="w-full h-[1px] bg-light-border-primary dark:bg-dark-border-primary my-2" />
                </Box>

                <Box row className="w-full">
                  <Box center col className="flex-1 gap-y-2 px-4 w-[100%]">
                    <Text fontWeight="medium" textStyle="caption" variant="secondary">
                      {t('common.memo')}
                    </Text>
                    <Tooltip content={swapMemo}>
                      <Text maxWidth="full" textStyle="caption">
                        {shortenAddress(swapMemo, 20)}
                      </Text>
                    </Tooltip>
                  </Box>
                </Box>

                <Box className="px-4">
                  <Box className="w-full h-[1px] bg-light-border-primary dark:bg-dark-border-primary my-2" />
                </Box>

                <Box row className="w-full">
                  <Box center col className="flex-1 gap-y-2 px-4 w-[100%]">
                    <Text fontWeight="medium" textStyle="caption" variant="secondary">
                      {t('common.memoHex')}
                    </Text>
                    <Tooltip content={memoHex}>
                      <Text maxWidth="100%" textStyle="caption">
                        {shortenAddress(memoHex, 20)}
                      </Text>
                    </Tooltip>
                  </Box>
                </Box>
              </>
            )}

            {!streamSwap && !showSmallSwapWarning && (
              <>
                <Box className="px-4">
                  <Box className="w-full h-[1px] bg-light-border-primary dark:bg-dark-border-primary my-2" />
                </Box>
                <Box row className="w-full">
                  <Box center col className="flex-1 gap-y-2">
                    <Text fontWeight="medium" textStyle="caption" variant="secondary">
                      {t('common.minReceived')}
                    </Text>
                    <Text textStyle="caption">{minReceive}</Text>
                  </Box>
                </Box>
              </>
            )}
          </Box>

          {streamSwap && (
            <InfoTip className="mt-4" title={t('views.swap.streamSwapDisclaimer')} type="warn" />
          )}

          {showSmallSwapWarning && (
            <Box row className="w-full my-3 px-4">
              <Icon className="inline" color="orange" name="infoCircle" size={26} />{' '}
              <Text className="ml-2" fontWeight="medium" textStyle="caption">
                {t('views.swap.smallSwapDisclaimer')}
              </Text>
            </Box>
          )}
        </Box>
      </>
    );
  },
);
