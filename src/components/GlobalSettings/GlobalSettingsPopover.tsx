import { Box, Button, Card, Icon } from 'components/Atomic';
import { GlobalSettings } from 'components/GlobalSettings';
import { Popover } from 'components/Popover';
import { PropsWithChildren } from 'react';
import { t } from 'services/i18n';

type Props = PropsWithChildren<{
  transactionMode?: boolean;
}>;

export const GlobalSettingsPopover = ({ transactionMode, children }: Props) => {
  return (
    <Popover
      trigger={
        <Button
          className="group"
          leftIcon={
            <Icon
              className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
              color="secondary"
              name="cog"
            />
          }
          px="2!"
          tooltip={t('common.settings')}
          tooltipPlacement="top"
          variant="borderlessTint"
        />
      }
    >
      <Card withBorder className="w-[350px] px-8 py-6 shadow-2xl">
        <Box col className="w-full gap-4">
          {children || <GlobalSettings transactionMode={transactionMode} />}
        </Box>
      </Card>
    </Popover>
  );
};
