import { Box, Icon, Link, Typography } from 'components/Atomic'
import { baseHoverClass } from 'components/constants'
import { TxStatusIcon } from 'components/TxManager/components/TxStatusIcon'
import { TxProgressStatus } from 'components/TxManager/types'

type Props = {
  status: TxProgressStatus
  label: string
  url?: string
}

export const TxInfoRow = ({ status, label, url }: Props) => {
  return (
    <Box justify="between" alignCenter>
      <Box className="w-full space-x-3" alignCenter>
        <Box center size={24}>
          <TxStatusIcon status={status} size={16} />
        </Box>
        <Typography variant="caption" fontWeight="normal">
          {label}
        </Typography>
      </Box>

      {url ? (
        <Link
          className="inline-flex"
          to={url}
          onClick={(e) => e.stopPropagation()}
        >
          <Icon
            className={baseHoverClass}
            name="external"
            color="secondary"
            size={18}
          />
        </Link>
      ) : (
        <div></div>
      )}
    </Box>
  )
}
