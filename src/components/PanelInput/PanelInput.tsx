import { Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { Box, Icon, useCollapse } from 'components/Atomic';
import { maxHeightTransitionClass } from 'components/Atomic/Collapse/Collapse';
import { borderHighlightClass } from 'components/constants';
import { Input } from 'components/Input';
import { useInputFocusState } from 'components/Input/hooks/useInputFocusState';
import { InputProps } from 'components/Input/types';
import { ReactNode, useEffect, useMemo } from 'react';

type Props = Omit<InputProps, 'title'> & {
  loading?: boolean;
  title: string | ReactNode;
  collapsible?: boolean;
};

export const PanelInput = ({
  title,
  collapsible,
  value,
  className,
  suffix,
  loading,
  ...inputProps
}: Props) => {
  const { ref, isFocused, focus, blur, onFocus, onBlur } = useInputFocusState();
  const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse();
  const fontSizeClass = useMemo(() => {
    const { length } = String(value);

    if (length > 50) {
      return '!text-[12px]';
    }

    if (length > 30) {
      return '!text-[14px]';
    }

    return '!text-[16px]';
  }, [value]);

  useEffect(() => {
    if (!isActive) {
      blur();
    }
  }, [blur, isActive]);

  return (
    <Box
      col
      className={classNames(
        'py-4 px-4 md:px-6 self-stretch !bg-light-bg-primary dark:!bg-dark-gray-light !rounded-2xl md:!rounded-3xl transition-all duration-300',
        'border border-transparent border-solid hover:border-light-gray-primary dark:hover:border-dark-gray-primary',
        {
          [borderHighlightClass]: isFocused,
          '!py-2': collapsible && !isActive,
        },
        className,
      )}
      onClick={focus}
    >
      <Box
        alignCenter
        className={classNames({ 'cursor-pointer': collapsible })}
        justify="between"
        onClick={toggle}
      >
        <Box center className="gap-x-2">
          {typeof title === 'string' ? (
            <Text fontWeight="normal" textStyle="caption">
              {title}
            </Text>
          ) : (
            title
          )}

          {loading && <Icon spin name="loader" size={14} />}
        </Box>

        {collapsible && (
          <Icon
            className={classNames('transform duration-300 ease inline-block', {
              '-rotate-180': isActive,
            })}
            color="secondary"
            name="chevronDown"
            size={20}
          />
        )}
      </Box>

      <div
        className={maxHeightTransitionClass}
        ref={contentRef}
        style={collapsible ? maxHeightStyle : undefined}
      >
        <Box alignCenter className="gap-3">
          <Box className="flex-1">
            <Input
              {...inputProps}
              stretch
              className={classNames('!font-medium flex-1', fontSizeClass)}
              containerClassName={classNames('pt-2 pb-0 flex-1', {
                'flex-1': !!suffix,
              })}
              onBlur={onBlur}
              onFocus={onFocus}
              ref={ref}
              value={value}
            />
          </Box>

          {suffix &&
            (typeof suffix === 'string' ? (
              <Text textStyle="caption-xs" variant="secondary">
                {suffix}
              </Text>
            ) : (
              suffix
            ))}
        </Box>
      </div>
    </Box>
  );
};
