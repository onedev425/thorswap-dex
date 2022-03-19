import {
  DISCORD_URL,
  TWITTER_URL,
  MEDIUM_URL,
  TELEGRAM_URL,
} from 'config/constants'

import { Box, Icon } from 'components/Atomic'

const SocialIcons = () => {
  return (
    <Box className="flex-1 gap-2" center>
      <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">
        <Icon
          name="telegram"
          className="hover:bg-telegram-blue p-2.5 rounded-2xl fill-telegram-blue hover:fill-white transform duration-300"
        />
      </a>
      <a href={DISCORD_URL} target="_blank" rel="noreferrer">
        <Icon
          name="discord"
          className="hover:bg-discord-purple p-2.5 rounded-2xl fill-discord-purple hover:fill-white transform duration-300"
        />
      </a>
      <a href={TWITTER_URL} target="_blank" rel="noreferrer">
        <Icon
          name="twitter"
          className="hover:bg-twitter-blue p-2.5 rounded-2xl fill-twitter-blue hover:fill-white transform duration-300"
        />
      </a>
      <a href={MEDIUM_URL} target="_blank" rel="noreferrer">
        <Icon
          name="medium"
          className="hover:bg-black hover:dark:bg-white p-2.5 rounded-2xl fill-black dark:fill-white hover:fill-white hover:dark:fill-black transform duration-300"
        />
      </a>
    </Box>
  )
}

export default SocialIcons
