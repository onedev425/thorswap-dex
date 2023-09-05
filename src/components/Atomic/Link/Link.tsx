import classNames from 'classnames';
import { Box } from 'components/Atomic/Box/Box';
import type { MouseEventHandler, ReactNode } from 'react';
import { memo } from 'react';
import { NavLink } from 'react-router-dom';

type LinkProps = {
  to: string;
  children?: ReactNode;
  className?: string;
  external?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export const Link = memo(({ className, to, children, external, onClick }: LinkProps) => {
  const externalHref = external || /^((http|https|ftp):\/\/)/.test(to.trim?.());

  return externalHref ? (
    <Box
      className={classNames(className, 'no-underline cursor-pointer')}
      onClick={() => window.open(to, '_blank', 'noopener,noreferrer')}
    >
      {children}
    </Box>
  ) : (
    <NavLink className={classNames(className, 'no-underline')} onClick={onClick} to={to}>
      {children}
    </NavLink>
  );
});
