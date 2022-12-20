import { THORNameDetails } from '@thorswap-lib/midgard-sdk';
import { Asset, THORName } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';
import { AssetIcon } from 'components/AssetIcon';
import { ChainIcon } from 'components/AssetIcon/ChainIcon';
import { Box, Button, Icon, Tooltip, Typography } from 'components/Atomic';
import { InfoRowConfig } from 'components/InfoRow/types';
import { shortenAddress } from 'helpers/shortenAddress';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import { getThornameExpireDate } from 'services/thorname';
import { useMidgard } from 'store/midgard/hooks';

type Params = {
  available: boolean;
  details: THORNameDetails | null;
  thorname: string;
  setYears: (years: number) => void;
  years: number;
};

export const useThornameInfoItems = ({ thorname, details, available, years, setYears }: Params) => {
  const { lastBlock } = useMidgard();
  const isAvailable = !details || available;

  const commonColumns = useMemo(
    () => [
      !details && { label: t('components.sidebar.thorname'), value: thorname },
      {
        label: t('views.thorname.status'),
        value: (
          <Typography color={isAvailable ? 'green' : 'red'}>
            {t(
              `views.thorname.${
                isAvailable ? (details ? 'ownedByYou' : 'available') : 'unavailable'
              }`,
            )}
          </Typography>
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
                    onClick={() => setYears(years - 1)}
                    startIcon={
                      <Icon
                        className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
                        color="secondary"
                        name="minusCircle"
                      />
                    }
                    type="borderless"
                    variant="tint"
                  />

                  <Box center className="w-3">
                    <Typography>{years}</Typography>
                  </Box>

                  <Button
                    className="px-1.5 group"
                    onClick={() => setYears(years + 1)}
                    startIcon={
                      <Icon
                        className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
                        color="secondary"
                        name="plusCircle"
                      />
                    }
                    type="borderless"
                    variant="tint"
                  />
                </Box>
              ),
            },
            {
              label: details ? t('views.thorname.updateFee') : t('views.thorname.registrationFee'),
              value: (
                <Box center className="gap-x-2">
                  <AssetIcon asset={Asset.RUNE()} size="tiny" />
                  <Typography>
                    {details ? years : THORName.getCost(years).toSignificant(6)} $RUNE
                  </Typography>
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
                  <Typography>
                    {getThornameExpireDate({
                      expire: details.expire,
                      lastThorchainBlock: lastBlock?.[0]?.thorchain,
                    })}
                  </Typography>
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
