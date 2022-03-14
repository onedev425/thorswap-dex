import classNames from 'classnames'

import { Icon } from 'components/Atomic'

const SocialIcons = () => {
  return (
    <div
      className={classNames(
        'w-full flex align-items-center justify-center justify-evenly social-icons',
      )}
    >
      <a href="https://t.me/thorswap_ann" target="_blank" rel="noreferrer">
        <Icon
          name="telegram"
          className="hover:bg-telegram-blue p-2.5 rounded-2xl fill-telegram-blue hover:fill-white "
        />
      </a>
      <a
        href="https://discord.com/invite/thorswap"
        target="_blank"
        rel="noreferrer"
      >
        <Icon
          name="discord"
          className="hover:bg-discord-purple p-2.5 rounded-2xl fill-discord-purple hover:fill-white"
        />
      </a>
      <a href="https://twitter.com/THORSwap" target="_blank" rel="noreferrer">
        <Icon
          name="twitter"
          className="hover:bg-twitter-blue p-2.5 rounded-2xl fill-twitter-blue hover:fill-white "
        />
      </a>
      <a href="https://thorswap.medium.com" target="_blank" rel="noreferrer">
        <Icon
          name="medium"
          className="hover:bg-black hover:dark:bg-white p-2.5 rounded-2xl fill-black dark:fill-white hover:fill-white hover:dark:fill-black"
        />
      </a>
    </div>
  )
}

export default SocialIcons
