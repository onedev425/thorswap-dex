import classNames from 'classnames';
import { Icon, IconName, Typography } from 'components/Atomic';
import { TooltipPlacement } from 'components/Atomic/Tooltip/types';
import useWindowSize from 'hooks/useWindowSize';
import { createRef, ReactNode, useCallback, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactTooltip from 'react-tooltip';

type Props = {
  place?: TooltipPlacement;
  content?: string;
  className?: string;
  disabled?: boolean;
} & ({ iconName: IconName; children?: undefined } | { children: ReactNode; iconName?: undefined });

const TOOLTIP_ICON = 14;

const tooltipRef = createRef<ReactTooltip>();

export const TooltipPortal = () => (
  <ReactTooltip
    aria-haspopup
    className="tooltip-container"
    effect="solid"
    id="tooltip"
    ref={tooltipRef}
  />
);

export const Tooltip = ({
  children,
  className,
  place,
  iconName,
  content,
  disabled = false,
}: Props) => {
  const { isMdActive } = useWindowSize();

  useEffect(() => {
    // https://github.com/wwayne/react-tooltip/issues/40#issuecomment-147552438
    setTimeout(ReactTooltip.rebuild, 100);
  }, []);

  const hideTooltip = useCallback(() => {
    if (tooltipRef.current) {
      tooltipRef.current.setState({ show: false });
    }
  }, []);

  return content ? (
    <div
      data-html
      className={classNames(
        'flex items-center justify-center',
        {
          'border border-solid bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary rounded-3xl w-6 h-6':
            !children,
        },
        className,
      )}
      data-for="tooltip"
      data-place={place}
      data-tip={ReactDOMServer.renderToString(
        <div
          className={classNames(
            'hidden sm:block px-5 py-2 rounded-2xl max-w-[260px]',
            'bg-light-bg-primary border border-light-border-primary border-solid dark:bg-dark-bg-primary dark:border-dark-border-primary',
          )}
        >
          <Typography className="font-bold" variant="caption-xs">
            {content}
          </Typography>
        </div>,
      )}
      data-tip-disable={disabled || !isMdActive}
      onMouseLeave={hideTooltip}
    >
      {children || <Icon color="secondary" name={iconName as IconName} size={TOOLTIP_ICON} />}
    </div>
  ) : (
    <>{children}</>
  );
};
