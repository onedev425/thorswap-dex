import classNames from 'classnames';
import { Box, Button, Icon, SwitchToggle, Typography } from 'components/Atomic';
import { Input } from 'components/Input';
import { memo } from 'react';
import { t } from 'services/i18n';
import { ViewMode } from 'types/app';

type Props = {
  walletViewMode: ViewMode;
  setWalletViewMode: (viewMode: ViewMode) => void;
  keyword: string;
  setKeyword: (keyword: string) => void;
  onlyConnected: boolean;
  setOnlyConnected: (onlyConnected: boolean) => void;
};

export const SearchAndFilters = memo(
  ({
    setOnlyConnected,
    onlyConnected,
    walletViewMode,
    setWalletViewMode,
    keyword,
    setKeyword,
  }: Props) => {
    return (
      <Box alignCenter className="w-full px-1.5 flex-wrap gap-2" justify="between">
        <Input
          border="rounded"
          icon="search"
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={t('views.wallet.search')}
          value={keyword}
        />

        <Box alignCenter className="space-x-6">
          <Box center className="gap-x-2 rounded-2xl">
            <Typography variant="caption">{t('views.wallet.showOnlyConnectedChains')}</Typography>
            <SwitchToggle checked={onlyConnected} onChange={setOnlyConnected} />
          </Box>

          <Box center>
            <Button
              className={classNames('pl-3 pr-3 !rounded-r-none', {
                '!bg-opacity-90 dark:!bg-opacity-50': walletViewMode === ViewMode.CARD,
              })}
              leftIcon={
                <Icon
                  className={classNames({
                    '!text-white !stroke-white': walletViewMode === ViewMode.CARD,
                  })}
                  name="grid"
                  size={20}
                />
              }
              onClick={() => setWalletViewMode(ViewMode.CARD)}
              tooltip={t('views.wallet.gridView')}
              variant={walletViewMode === ViewMode.CARD ? 'primary' : 'outlineTint'}
            />

            <Button
              className={classNames('pl-2 pr-3 !rounded-l-none', {
                '!bg-opacity-90 dark:!bg-opacity-50': walletViewMode === ViewMode.LIST,
              })}
              leftIcon={
                <Icon
                  className={classNames({
                    '!text-white !stroke-white': walletViewMode === ViewMode.LIST,
                  })}
                  name="list"
                  size={20}
                />
              }
              onClick={() => setWalletViewMode(ViewMode.LIST)}
              tooltip={t('views.wallet.listView')}
              variant={walletViewMode === ViewMode.LIST ? 'primary' : 'outlineTint'}
            />
          </Box>
        </Box>
      </Box>
    );
  },
);
