import classNames from 'classnames';
import { alignClasses, BoxProps, justifyClasses } from 'components/Atomic/Box/types';
import { CSSProperties, forwardRef, useMemo } from 'react';

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      className,
      children,
      col,
      center,
      alignCenter,
      justifyCenter,
      align,
      justify,
      row,
      flex,
      style,
      ...rest
    },
    ref,
  ) => {
    const styles = useMemo(() => ({ ...(style || {}), flex }) as CSSProperties, [flex, style]);

    return (
      <div
        {...rest}
        className={classNames(
          'flex',
          {
            'flex-col': col,
            'flex-row': row,
            'items-center': alignCenter || center,
            'justify-center': justifyCenter || center,
          },
          align && alignClasses[align],
          justify && justifyClasses[justify],
          className,
        )}
        ref={ref}
        style={styles}
      >
        {children}
      </div>
    );
  },
);
