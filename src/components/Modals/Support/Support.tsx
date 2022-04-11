import { DISCORD_URL } from 'config/constants'

import { Box, Icon, Link, Modal, Typography } from 'components/Atomic'

import { t } from 'services/i18n'

type Props = {
  isOpen: boolean
  onCancel?: () => void
}

export const SupportModal = ({
  isOpen,
  onCancel = () => {},
}: Props): JSX.Element => {
  return (
    <Modal title={t('common.support')} isOpened={isOpen} onClose={onCancel}>
      <Box className="!w-[300px] md:!w-[350px] gap-3" col>
        <Typography>{t('common.supportInfo')}</Typography>

        <Link to={DISCORD_URL}>
          <Box
            className="bg-discord-purple p-2.5 rounded-2xl gap-3 hover:bg-opacity-80 transition"
            center
          >
            <Typography className="!text-white">
              {t('common.joinDiscord')}
            </Typography>
            <Icon name="discord" className="fill-white" />
          </Box>
        </Link>
      </Box>
    </Modal>
  )
}
