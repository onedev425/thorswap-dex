import classNames from 'classnames';
import { Box } from 'components/Atomic/Box/Box';
import { memo, MouseEventHandler, ReactNode } from 'react';
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
      className={classNames(className, '!inline-block no-underline')}
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
