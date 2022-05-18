import { ReactNode, useEffect } from 'react'

import ReactTooltip from 'react-tooltip'

import classNames from 'classnames'
import ReactDOM from 'react-dom/server'

import { Typography, Icon, IconName } from 'components/Atomic'
import { TooltipPlacement } from 'components/Atomic/Tooltip/types'

import useWindowSize from 'hooks/useWindowSize'

type Props = {
  place?: TooltipPlacement
  content?: string
  className?: string
  disabled?: boolean
} & (
  | { iconName: IconName; children?: undefined }
  | { children: ReactNode; iconName?: undefined }
)

const TOOLTIP_ICON = 14

export const TooltipPortal = () => (
  <ReactTooltip
    aria-haspopup
    className="whitespace-pre-line tooltip-container "
    effect="solid"
    id="tooltip"
  />
)

export const Tooltip = ({
  children,
  className,
  place,
  iconName,
  content,
  disabled = false,
}: Props) => {
  const { isMdActive } = useWindowSize()

  useEffect(() => {
    // https://github.com/wwayne/react-tooltip/issues/40#issuecomment-147552438
    setTimeout(ReactTooltip.rebuild, 50)
  }, [])

  return content ? (
    <div
      data-for="tooltip"
      data-html
      data-place={place}
      data-tip-disable={disabled || !isMdActive}
      className={classNames(
        'flex items-center justify-center',
        {
          'border border-solid bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary rounded-3xl w-6 h-6':
            !children,
        },
        className,
      )}
      data-tip={ReactDOM.renderToStaticMarkup(
        <div
          className={classNames(
            'hidden sm:block px-5 py-2 rounded-2xl max-w-[260px]',
            'bg-light-bg-primary border border-light-border-primary border-solid dark:bg-dark-bg-primary dark:border-dark-border-primary',
          )}
        >
          <Typography variant="caption-xs" className="font-bold">
            {content}
          </Typography>
        </div>,
      )}
    >
      {children || (
        <Icon
          color="secondary"
          name={iconName as IconName}
          size={TOOLTIP_ICON}
        />
      )}
    </div>
  ) : (
    <>{children}</>
  )
}
