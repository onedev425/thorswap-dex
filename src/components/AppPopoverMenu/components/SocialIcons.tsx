import { memo } from 'react'

import classNames from 'classnames'
import {
  DISCORD_URL,
  TWITTER_URL,
  MEDIUM_URL,
  TELEGRAM_URL,
  THORSWAP_YOUTUBE_URL,
  THORCHADS_MERCH_URL,
  THORSWAP_DOCUMENTATION_URL,
} from 'config/constants'

import { Box, Icon, Link, Tooltip } from 'components/Atomic'

import { t } from 'services/i18n'

const commonClasses = 'p-2.5 rounded-2xl transform '

export const SocialIcons = memo(() => {
  return (
    <Box className="flex-1 gap-2 flex-wrap" center>
      <Tooltip place="bottom" content={t('common.documentation')}>
        <Link to={THORSWAP_DOCUMENTATION_URL}>
          <Icon
            name="docs"
            className={classNames(
              commonClasses,
              'hover:bg-btn-primary fill-btn-primary hover:fill-white',
            )}
          />
        </Link>
      </Tooltip>
      <Tooltip place="bottom" content="Discord">
        <Link to={DISCORD_URL}>
          <Icon
            name="discord"
            className={classNames(
              commonClasses,
              'hover:bg-discord-purple fill-discord-purple hover:fill-white',
            )}
          />
        </Link>
      </Tooltip>
      <Tooltip place="bottom" content="Twitter">
        <Link to={TWITTER_URL}>
          <Icon
            name="twitter"
            className={classNames(
              commonClasses,
              'hover:bg-twitter-blue fill-twitter-blue hover:fill-white',
            )}
          />
        </Link>
      </Tooltip>
      <Tooltip place="bottom" content="Medium">
        <Link to={MEDIUM_URL}>
          <Icon
            name="medium"
            className={classNames(
              commonClasses,
              'hover:bg-black hover:dark:bg-white fill-black dark:fill-white hover:fill-white hover:dark:fill-black',
            )}
          />
        </Link>
      </Tooltip>
      <Tooltip place="bottom" content="Youtube">
        <Link to={THORSWAP_YOUTUBE_URL}>
          <Icon
            name="youtube"
            className={classNames(
              commonClasses,
              'hover:bg-youtube-red fill-youtube-red hover:fill-white',
            )}
          />
        </Link>
      </Tooltip>
      <Tooltip place="bottom" content="Telegram">
        <Link to={TELEGRAM_URL}>
          <Icon
            name="telegram"
            className={classNames(
              commonClasses,
              'hover:bg-telegram-blue fill-telegram-blue hover:fill-white',
            )}
          />
        </Link>
      </Tooltip>
      <Tooltip place="bottom" content={t('common.merchStore')}>
        <Link to={THORCHADS_MERCH_URL}>
          <Icon
            name="cart"
            className={classNames(
              commonClasses,
              'hover:bg-chain-thor fill-chain-thor hover:fill-white',
            )}
          />
        </Link>
      </Tooltip>
    </Box>
  )
})
