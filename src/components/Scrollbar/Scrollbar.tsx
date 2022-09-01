import { ReactNode, useCallback, useMemo } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

import { useTheme } from '../Theme/ThemeContext';

type ScrollbarProps = {
  children: ReactNode;
  secondary?: boolean;
  scrollClassName?: string;
  className?: string;
  height?: string;
  maxHeight?: number | string;
  minHeight?: number | string;
  autoHeight?: boolean;
};

export const Scrollbar = ({
  height,
  minHeight,
  maxHeight,
  children,
  className,
  autoHeight,
  secondary,
  scrollClassName,
}: ScrollbarProps) => {
  const { isLight } = useTheme();
  const useAutoHeight = !!maxHeight || !!minHeight || autoHeight;
  const [light, dark] = useMemo(
    () => (secondary ? ['#F0F1F3', '#121526'] : ['#afb6cc', '#29354a']),
    [secondary],
  );

  const renderThumbnail = useCallback(
    (props: { style: Record<string, string> }) => (
      <div
        className={scrollClassName}
        style={{
          ...props.style,
          borderRadius: '4px',
          backgroundColor: isLight ? light : dark,
          width: '4px',
        }}
      />
    ),
    [dark, isLight, light, scrollClassName],
  );

  const style = useMemo(
    () => (useAutoHeight ? {} : { height: height || '100vh' }),
    [height, useAutoHeight],
  );

  return (
    <Scrollbars
      autoHide
      autoHeight={useAutoHeight}
      autoHeightMax={maxHeight}
      autoHeightMin={minHeight}
      className={className}
      renderThumbVertical={renderThumbnail}
      style={style}
    >
      {children}
    </Scrollbars>
  );
};
