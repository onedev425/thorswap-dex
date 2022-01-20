import { BsDiscord, BsMedium, BsTelegram, BsTwitter } from 'react-icons/bs'
import { IconType } from 'react-icons/lib'

export type IconName = 'discord' | 'medium' | 'telegram' | 'twitter'

const Icons: Record<IconName, IconType> = {
  discord: BsDiscord,
  medium: BsMedium,
  telegram: BsTelegram,
  twitter: BsTwitter,
}

export default Icons
