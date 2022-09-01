import { SupportedChain } from '@thorswap-lib/types';
import { Box, Collapse, Icon, Tooltip, Typography } from 'components/Atomic';
import { HighlightCard } from 'components/HighlightCard';
import { HoverIcon } from 'components/HoverIcon';
import { InfoTable } from 'components/InfoTable';
import { Scrollbar } from 'components/Scrollbar';
import { shortenAddress } from 'helpers/shortenAddress';
import { useFetchThornames } from 'hooks/useFetchThornames';
import { memo } from 'react';
import { t } from 'services/i18n';
import { getThornameExpireDate } from 'services/thorname';
import { useMidgard } from 'store/midgard/hooks';
import { thornameChainIcons } from 'views/Thorname/ChainDropdown';

type Props = {
  editThorname: (thorname: string) => void;
};

export const RegisteredThornames = memo(({ editThorname }: Props) => {
  const thornames = useFetchThornames();
  const { lastBlock } = useMidgard();

  if (!thornames?.length) return null;

  return (
    <Box col className="pt-8 w-full">
      <Typography className="pb-4" variant="h5">
        {t('views.thorname.myThornames')}
      </Typography>

      <Scrollbar secondary maxHeight="60vh" scrollClassName="!mr-2">
        {thornames.map(({ thorname, expire, entries, owner }) => (
          <HighlightCard className="!p-0 m-2" key={`${thorname}-${owner}-${expire}`}>
            <Collapse
              className="!py-1"
              shadow={false}
              title={
                <Box alignCenter row className="gap-2" flex={1} justify="between">
                  <Typography>{thorname}</Typography>
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
                        <Typography>
                          {getThornameExpireDate({
                            expire,
                            lastThorchainBlock: lastBlock?.[0]?.thorchain,
                          })}
                        </Typography>
                      </Box>
                    ),
                  },
                  { label: t('views.thorname.owner'), value: owner },
                  ...entries.map(({ address, chain }) => ({
                    label: (
                      <Icon className="px-2" name={thornameChainIcons[chain as SupportedChain]} />
                    ),
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
