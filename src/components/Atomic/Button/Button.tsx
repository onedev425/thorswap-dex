import { Box, Button as ChakraButton, ButtonProps, ResponsiveValue, Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { Icon, TextTransform, Tooltip } from 'components/Atomic';
import { ButtonSizes } from 'components/Atomic/Button/types';
import { TooltipPlacement } from 'components/Atomic/Tooltip/types';
import {
  MouseEvent,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  useLayoutEffect,
  useRef,
} from 'react';

type Props = {
  children?: ReactNode;
  disabled?: boolean;
  variant?: string;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  transform?: ResponsiveValue<TextTransform>;
  textColor?: string;
  typographyVariant?: string;
  size?: ButtonSizes;
  tooltipPlacement?: TooltipPlacement;
  tooltip?: string;
  error?: boolean;
  stretch?: boolean;
  tooltipClasses?: string;
} & ButtonProps;

export const Button = ({
  children,
  disabled,
  variant = 'primary',
  transform = 'capitalize',
  loading,
  onClick,
  leftIcon,
  rightIcon,
  textColor,
  typographyVariant,
  size = 'sm',
  tooltipPlacement = 'top',
  tooltip,
  error = false,
  stretch = false,
  tooltipClasses = '',
  as: _as,
  ...props
}: Props) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const timeoutBlur = (timeout = 0) => {
    setTimeout(() => buttonRef.current?.blur(), timeout);
  };

  useLayoutEffect(() => {
    timeoutBlur(0);
  }, []);

  const disabledButton = disabled || loading;

  // It helps to remove focus state from button focus styles be applied only on `tab` select
  const handleClick = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    if (error || disabledButton) return;

    onClick?.(event);
    timeoutBlur();
  };

  const isFancy = variant === 'fancy';
  const ContentWrapper = ['string', 'number'].includes(typeof children) ? Text : Box;
  const iconSpacing = leftIcon && !children ? '0px' : '8px';
  const leftIconItem = loading ? undefined : leftIcon;
  const rightIconItem = loading ? undefined : rightIcon;
  const buttonVariant = error && isFancy ? 'fancyError' : variant;
  const width = stretch ? 'full' : 'auto';

  return (
    <Tooltip
      className={classNames(tooltipClasses, { 'w-full': stretch })}
      content={tooltip}
      place={tooltipPlacement}
    >
      {/* @ts-ignore */}
      <ChakraButton
        {...props}
        iconSpacing={iconSpacing}
        isDisabled={disabledButton}
        leftIcon={leftIconItem}
        minW={0}
        onClick={handleClick}
        onMouseDown={() => timeoutBlur(300)}
        ref={buttonRef}
        rightIcon={rightIconItem}
        size={size}
        variant={buttonVariant}
        width={width}
      >
        {loading ? (
          <Icon spin color="primary" name="loader" size={24} />
        ) : (
          <ContentWrapper
            color={textColor}
            fontWeight={isFancy ? 600 : 700}
            textDecorationLine="none"
            textStyle={
              ['sm', 'xs'].includes(size) ? 'caption-xs' : size === 'md' ? 'caption' : 'subtitle2'
            }
            textTransform={transform}
            variant={typographyVariant}
          >
            {children}
          </ContentWrapper>
        )}
      </ChakraButton>
    </Tooltip>
  );
};
