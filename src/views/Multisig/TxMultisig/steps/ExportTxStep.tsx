import { useCallback } from 'react'

import { Box, Button, Icon, Typography } from 'components/Atomic'
import { StepActions } from 'components/Stepper'
import { showErrorToast } from 'components/Toast'

import { t } from 'services/i18n'

import { downloadAsFile } from 'helpers/download'

const MULTISIG_FILE_NAME = 'thorsafe-tx.json'

type Props = {
  exportTxData: ToDo
}

export function ExportTxStep({ exportTxData }: Props) {
  const handleExport = useCallback(async () => {
    try {
      await downloadAsFile(MULTISIG_FILE_NAME, JSON.stringify(exportTxData))
    } catch (error: ErrorType) {
      const message = error.message || t('views.multisig.exportError')
      showErrorToast(message)
    }
  }, [exportTxData])

  return (
    <Box className="self-stretch mx-2" col flex={1}>
      <Box className="gap-2 mt-6" col>
        <Typography variant="caption" fontWeight="normal">
          {t('views.multisig.exportTxInfo')}
        </Typography>
        <Button stretch onClick={handleExport} endIcon={<Icon name="export" />}>
          {t('views.multisig.export')}
        </Button>
      </Box>

      <StepActions />
    </Box>
  )
}
