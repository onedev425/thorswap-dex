import classNames from 'classnames';
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
    <a
      className={classNames(className, 'no-underline')}
      href=""
      onClick={(e) => {
        e.preventDefault();
        window.open(to, '_blank', 'noopener,noreferrer');
      }}
    >
      {children}
    </a>
  ) : (
    <NavLink className={classNames(className, 'no-underline')} onClick={onClick} to={to}>
      {children}
    </NavLink>
  );
});
