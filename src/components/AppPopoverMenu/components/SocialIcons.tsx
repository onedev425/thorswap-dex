import classNames from 'classnames';
import { Box, Icon, Link, Tooltip } from 'components/Atomic';
import {
  DISCORD_URL,
  MEDIUM_URL,
  TELEGRAM_URL,
  THORCHADS_MERCH_URL,
  THORSWAP_DOCUMENTATION_URL,
  THORSWAP_YOUTUBE_URL,
  TWITTER_URL,
} from 'config/constants';
import { memo } from 'react';
import { t } from 'services/i18n';

const commonClasses = 'p-2.5 rounded-2xl transform ';

export const SocialIcons = memo(() => {
  return (
    <Box center className="flex-1 gap-2 flex-wrap">
      <Tooltip content={t('common.documentation')} place="bottom">
        <Link to={THORSWAP_DOCUMENTATION_URL}>
          <Icon
            className={classNames(
              commonClasses,
              'hover:bg-btn-primary fill-btn-primary hover:fill-white',
            )}
            name="docs"
          />
        </Link>
      </Tooltip>
      <Tooltip content="Discord" place="bottom">
        <Link to={DISCORD_URL}>
          <Icon
            className={classNames(
              commonClasses,
              'hover:bg-discord-purple fill-discord-purple hover:fill-white',
            )}
            name="discord"
          />
        </Link>
      </Tooltip>
      <Tooltip content="Twitter" place="bottom">
        <Link to={TWITTER_URL}>
          <Icon
            className={classNames(
              commonClasses,
              'hover:bg-twitter-blue fill-twitter-blue hover:fill-white',
            )}
            name="twitter"
          />
        </Link>
      </Tooltip>
      <Tooltip content="Medium" place="bottom">
        <Link to={MEDIUM_URL}>
          <Icon
            className={classNames(
              commonClasses,
              'hover:bg-black hover:dark:bg-white fill-black dark:fill-white hover:fill-white hover:dark:fill-black',
            )}
            name="medium"
          />
        </Link>
      </Tooltip>
      <Tooltip content="Youtube" place="bottom">
        <Link to={THORSWAP_YOUTUBE_URL}>
          <Icon
            className={classNames(
              commonClasses,
              'hover:bg-youtube-red fill-youtube-red hover:fill-white',
            )}
            name="youtube"
          />
        </Link>
      </Tooltip>
      <Tooltip content="Telegram" place="bottom">
        <Link to={TELEGRAM_URL}>
          <Icon
            className={classNames(
              commonClasses,
              'hover:bg-telegram-blue fill-telegram-blue hover:fill-white',
            )}
            name="telegram"
          />
        </Link>
      </Tooltip>
      <Tooltip content={t('common.merchStore')} place="bottom">
        <Link to={THORCHADS_MERCH_URL}>
          <Icon
            className={classNames(
              commonClasses,
              'hover:bg-chain-thor fill-chain-thor hover:fill-white',
            )}
            name="cart"
          />
        </Link>
      </Tooltip>
    </Box>
  );
});
