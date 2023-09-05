import { Text } from '@chakra-ui/react';
import type { Chain } from '@thorswap-lib/types';
import { ChainIcon } from 'components/AssetIcon/ChainIcon';
import { Box, Collapse, Tooltip } from 'components/Atomic';
import { HighlightCard } from 'components/HighlightCard';
import { HoverIcon } from 'components/HoverIcon';
import { InfoTable } from 'components/InfoTable';
import { Scrollbar } from 'components/Scrollbar';
import { shortenAddress } from 'helpers/shortenAddress';
import { useFetchThornames } from 'hooks/useFetchThornames';
import { memo } from 'react';
import { t } from 'services/i18n';
import { getThornameExpireDate } from 'store/midgard/actions';
import { useMidgard } from 'store/midgard/hooks';

type Props = {
  editThorname: (thorname: string) => void;
};

export const RegisteredThornames = memo(({ editThorname }: Props) => {
  const thornames = useFetchThornames();
  const { lastBlock } = useMidgard();

  if (!thornames?.length) return null;

  return (
    <Box col className="pt-8 w-full">
      <Text className="pb-4" textStyle="h5">
        {t('views.thorname.myThornames')}
      </Text>

      <Scrollbar secondary maxHeight="60vh" scrollClassName="!mr-2">
        {thornames.map(({ thorname, expire, entries = [], owner }) => (
          <HighlightCard className="!p-0 m-2" key={`${thorname}-${owner}-${expire}`}>
            <Collapse
              className="!py-1"
              shadow={false}
              title={
                <Box alignCenter row className="gap-2" flex={1} justify="between">
                  <Text>{thorname}</Text>
                  <HoverIcon iconName="edit" onClick={() => editThorname(thorname)} size={16} />
                </Box>
              }
            >
              <InfoTable
                items={[
                  {
                    label: t('views.thorname.expire'),
                    value: (
                      <Box center className="gap-x-2">
                        <Tooltip
                          content={t('views.thorname.expirationNote', {
                            block: expire,
                          })}
                          iconName="infoCircle"
                        />
                        <Text>
                          {getThornameExpireDate({
                            expire: expire || '0',
                            lastThorchainBlock: lastBlock?.[0]?.thorchain,
                          })}
                        </Text>
                      </Box>
                    ),
                  },
                  { label: t('views.thorname.owner'), value: owner },
                  ...entries.map(({ address, chain }) => ({
                    label: <ChainIcon withoutBackground chain={chain as Chain} size={24} />,
                    value: shortenAddress(address, 15),
                  })),
                ]}
              />
            </Collapse>
          </HighlightCard>
        ))}
      </Scrollbar>
    </Box>
  );
});
