import classNames from 'classnames'

import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { Card } from 'components/Card'
import { Typography } from 'components/Typography'

import { AnnouncementProps } from './types'

const beforeClasses =
  'before:content-[""] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-box-lg before:opacity-30 before:bg-card-before'

const afterClasses =
  'after:content-[""] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-box-lg after:opacity-30 after:bg-card-after'

export const Announcement = ({
  title,
  subTitle,
  buttonText,
  action,
}: AnnouncementProps) => {
  return (
    <Card
      stretch
      size="lg"
      className={classNames('py-2.5 relative', beforeClasses, afterClasses)}
    >
      <Box justify="between" className="w-full relative z-[1]">
        <Box alignCenter className="gap-x-1">
          <Typography variant="body" color="primary" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="body" color="secondary" fontWeight="bold">
            {subTitle}
          </Typography>
        </Box>
        <Button textColor="cyan" size="large" onClick={action} borderless>
          {buttonText}
        </Button>
      </Box>
    </Card>
  )
}
