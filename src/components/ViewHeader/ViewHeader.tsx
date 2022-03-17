import { ReactNode } from 'react'

import { useNavigate } from 'react-router-dom'

import { Box, Icon, Typography } from 'components/Atomic'

type Props = {
  title: string
  withBack?: boolean
  actionsComponent?: ReactNode
}

export const ViewHeader = ({ title, withBack, actionsComponent }: Props) => {
  const navigate = useNavigate()

  return (
    <Box justify="between" alignCenter>
      <Box alignCenter>
        {withBack && (
          <Icon
            name="arrowBack"
            color="secondary"
            className=""
            onClick={() => navigate(-1)}
          />
        )}
        <Typography className="mx-3" variant="h3">
          {title}
        </Typography>
      </Box>

      {!!actionsComponent && (
        <Box center pr={2}>
          {actionsComponent}
        </Box>
      )}
    </Box>
  )
}
