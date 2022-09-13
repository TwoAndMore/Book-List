import { NavLink } from 'react-router-dom';
import React from 'react';
import classNames from 'classnames';

type Props = {
  to: string,
  text: string,
};

export const PageNavLink: React.FC<Props> = (props) => {
  const { to, text } = props;

  return (
    <NavLink
      to={to}
      className={({ isActive }) => classNames(
        'navbar__item',
        {
          'navbar__item--active': isActive,
        },
      )}
    >
      {text}
    </NavLink>
  );
};
