import classNames from 'classnames';
import React from 'react';
import { User } from '../../types/user';

interface Props {
  user: User,
}

export const ProductUser: React.FC<Props> = ({ user }) => {
  const {
    name,
    sex,
  } = user;

  return (
    <td
      data-cy="ProductUser"
      className={classNames({
        'has-text-danger': sex === 'f',
        'has-text-link': sex === 'm',
      })}
    >
      {name}
    </td>
  );
};
