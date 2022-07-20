import { id } from '@ethersproject/hash'

import { AnnouncementItem } from 'store/externalConfig/types'

export const getAnnouncementId = (ann: AnnouncementItem) => {
  return id(
    ann.message +
      (ann.type || '') +
      (ann.link?.name || '') +
      (ann.link?.url || '') +
      (ann.chain || ''),
  )
}
