import type { CSSProperties, PropsWithChildren } from 'react';

export type CustomAlignType = 'start' | 'end' | 'stretch' | 'baseline';

export type CustomJustifyType = 'start' | 'end' | 'between' | 'around' | 'evenly';

type AlignProps = {
  align?: CustomAlignType;
  alignCenter?: boolean;
};

type JustifyProps = {
  justify?: CustomJustifyType;
  justifyCenter?: boolean;
};

export type BoxProps = PropsWithChildren<
  {
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    style?: CSSProperties;
    className?: string;
    col?: boolean;
    row?: boolean;
    flex?: number;
  } & (
    | ({
        justify: CustomJustifyType;
        justifyCenter?: undefined;
        center?: undefined;
      } & AlignProps)
    | ({
        align: CustomAlignType;
        alignCenter?: undefined;
        center?: undefined;
      } & JustifyProps)
    | {
        center?: boolean;
        alignCenter?: undefined;
        justifyCenter?: undefined;
        align?: undefined;
        justify?: undefined;
      }
    | ({
        alignCenter: boolean;
        center?: undefined;
        align?: undefined;
      } & JustifyProps)
    | ({
        justifyCenter: boolean;
        center?: undefined;
        justify?: undefined;
      } & AlignProps)
  )
>;

export const alignClasses: Record<CustomAlignType, string> = {
  start: 'items-start',
  end: 'items-end',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

export const justifyClasses: Record<CustomJustifyType, string> = {
  start: 'justify-start',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};
