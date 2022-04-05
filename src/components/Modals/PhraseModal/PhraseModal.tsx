import classNames from 'classnames'

import { Box, Button, Icon, Modal, Typography } from 'components/Atomic'
import {
  borderHoverHighlightClass,
  genericBgClasses,
} from 'components/constants'
import { Input } from 'components/Input'
import { usePhraseModal } from 'components/Modals/PhraseModal/usePhraseModal'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

export type PhraseModalProps = {
  isOpen: boolean
  onCancel?: () => void
}

export const PhraseModal = ({
  isOpen,
  onCancel = () => {},
}: PhraseModalProps): JSX.Element => {
  const { showPhrase, submit, passwordField, errors, handleCopyPhrase } =
    usePhraseModal(isOpen)
  const phrases = multichain.getPhrase().split(' ')

  return (
    <Modal
      title={t('views.walletModal.phrase')}
      isOpened={isOpen}
      onClose={onCancel}
    >
      <Box className="md:!min-w-[350px]">
        {showPhrase ? (
          <Box className="gap-2" col>
            <Box justify="end">
              <Button
                type="borderless"
                variant="tint"
                endIcon={<Icon name="copy" color="primaryBtn" />}
                onClick={handleCopyPhrase}
              >
                {t('views.walletModal.copyPhrase')}
              </Button>
            </Box>
            <Box
              className={classNames(
                'grid p-2.5 rounded-2xl grid-cols-4',
                genericBgClasses.primary,
                borderHoverHighlightClass,
              )}
            >
              {phrases.map((phrase: string, index: number) => {
                return (
                  <Box className="p-1.5" key={phrase} alignCenter>
                    <Typography>
                      {index + 1}. {phrase}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          </Box>
        ) : (
          <Box className="gap-1.5" col flex={1}>
            <Box className="px-1.5">
              <Typography>
                {t('views.walletModal.enterKeystorePassword')}
              </Typography>
            </Box>
            <Input
              type="password"
              placeholder={t('common.password')}
              autoComplete="new-password"
              stretch
              autoFocus
              className="!text-md p-1.5 flex-1 border"
              border="rounded"
              icon="lock"
              {...passwordField}
            />
            {errors.password && (
              <Box className="px-1.5">
                <Typography color="red">
                  {t('views.walletModal.wrongPassword')}
                </Typography>
              </Box>
            )}
            <Box justifyCenter mt={4}>
              <Button onClick={submit} stretch>
                {t('views.walletModal.viewPhrase')}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  )
}
