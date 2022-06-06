import { utils } from 'ethers'

import { AnnouncementItem } from 'store/externalConfig/types'

export const getAnnouncementId = (ann: AnnouncementItem) => {
  return utils.id(
    ann.message +
      (ann.type || '') +
      (ann.link?.name || '') +
      (ann.link?.url || '') +
      (ann.chain || ''),
  )
}
