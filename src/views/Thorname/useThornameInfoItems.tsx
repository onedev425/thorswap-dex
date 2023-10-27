import { Text } from '@chakra-ui/react';
import { getTHORNameCost } from '@thorswap-lib/swapkit-core';
import type { Chain } from '@thorswap-lib/types';
import { AssetIcon } from 'components/AssetIcon';
import { ChainIcon } from 'components/AssetIcon/ChainIcon';
import { Box, Button, Icon, Tooltip } from 'components/Atomic';
import type { InfoRowConfig } from 'components/InfoRow/types';
import { RUNEAsset } from 'helpers/assets';
import { shortenAddress } from 'helpers/shortenAddress';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import { getThornameExpireDate } from 'store/midgard/actions';
import { useMidgard } from 'store/midgard/hooks';
import type { THORNameDetails } from 'types/app';
import { CopyValue } from 'views/Wallet/components/CopyValue';

type Params = {
  available: boolean;
  details: Maybe<THORNameDetails>;
  thorname: string;
  setYears: (years: number) => void;
  years: number;
};

export const useThornameInfoItems = ({ thorname, details, available, years, setYears }: Params) => {
  const { lastBlock } = useMidgard();
  const isAvailable = !details || available;

  const commonColumns = useMemo(
    () => [
      !details && {
        label: t('components.sidebar.thorname'),
        value: (
          <div className="flex">
            {thorname} <CopyValue type="icon" value={thorname} />
          </div>
        ),
      },
      {
        label: t('views.thorname.status'),
        value: (
          <Text variant={isAvailable ? 'green' : 'red'}>
            {t(
              `views.thorname.${
                isAvailable ? (details ? 'ownedByYou' : 'available') : 'unavailable'
              }`,
            )}
          </Text>
        ),
      },

      ...(isAvailable
        ? [
            {
              label: details ? t('views.thorname.extend') : t('views.thorname.duration'),
              value: (
                <Box alignCenter className="gap-x-2" justify="between">
                  <Button
                    className="px-1.5 group"
                    leftIcon={
                      <Icon
                        className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
                        color="secondary"
                        name="minusCircle"
                      />
                    }
                    onClick={() => setYears(years - 1)}
                    variant="borderlessTint"
                  />

                  <Box center className="w-3">
                    <Text>{years}</Text>
                  </Box>

                  <Button
                    className="px-1.5 group"
                    leftIcon={
                      <Icon
                        className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
                        color="secondary"
                        name="plusCircle"
                      />
                    }
                    onClick={() => setYears(years + 1)}
                    variant="borderlessTint"
                  />
                </Box>
              ),
            },
            {
              label: details ? t('views.thorname.updateFee') : t('views.thorname.registrationFee'),
              value: (
                <Box center className="gap-x-2">
                  <AssetIcon asset={RUNEAsset} size="tiny" />
                  <Text>{details ? years : getTHORNameCost(years)} $RUNE</Text>
                </Box>
              ),
            },
          ]
        : []),
    ],
    [details, isAvailable, setYears, thorname, years],
  );

  const ownerColumns = useMemo(
    () =>
      details
        ? [
            {
              label: t('views.thorname.expire'),
              value: (
                <Box center className="gap-x-2">
                  <Tooltip
                    content={t('views.thorname.expirationNote', {
                      block: details.expire,
                    })}
                    iconName="infoCircle"
                  />
                  <Text>
                    {getThornameExpireDate({
                      expire: details.expire,
                      lastThorchainBlock: lastBlock?.[0]?.thorchain,
                    })}
                  </Text>
                </Box>
              ),
            },
            {
              label: t('views.thorname.owner'),
              value: shortenAddress(details.owner, 15),
            },
          ]
        : [],
    [details, lastBlock],
  );

  const data = useMemo(
    () =>
      [
        ...commonColumns,
        ...ownerColumns,
        ...(details
          ? details.entries.map(({ address, chain }) => ({
              key: chain,
              label: (
                <Tooltip content={`${thorname}.${chain}`}>
                  <ChainIcon withoutBackground chain={chain as Chain} size={24} />
                </Tooltip>
              ),
              value: shortenAddress(address, 15),
            }))
          : []),
      ].filter(Boolean),
    [commonColumns, details, ownerColumns, thorname],
  );

  return {
    ownerColumns,
    data: details || available ? (data as InfoRowConfig[]) : [],
  };
};
