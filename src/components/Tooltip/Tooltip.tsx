import ReactTooltip from 'react-tooltip'

import classNames from 'classnames'
import ReactDOM from 'react-dom/server'

import { Icon, IconName } from 'components/Icon'
import { Typography } from 'components/Typography'

type Props = {
  iconName: IconName
  place?: 'top' | 'bottom' | 'left' | 'right'
  content: string
  className?: string
}

const TOOLTIP_ICON = 14

export const TooltipPortal = () => (
  <ReactTooltip className="tooltip-container" effect="solid" id="tooltip" />
)

export const Tooltip = (props: Props) => {
  const { className, place, iconName, content } = props

  return (
    <div
      data-for="tooltip"
      data-html
      data-place={place}
      className={classNames(
        'flex border border-solid bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary rounded-3xl w-6 h-6 items-center justify-center',
        className,
      )}
      data-tip={ReactDOM.renderToStaticMarkup(
        <div className="bg-light-bg-primary border border-light-border-primary border-solid dark:bg-dark-bg-primary dark:border-dark-border-primary px-5 py-2 rounded-2xl">
          <Typography variant="caption-xs" className="font-bold">
            {content}
          </Typography>
        </div>,
      )}
    >
      <Icon color="secondary" name={iconName as IconName} size={TOOLTIP_ICON} />
    </div>
  )
}
