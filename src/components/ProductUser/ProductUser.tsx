import React from 'react';
import cn from 'classnames';
import { User } from '../../types';

type Props = {
  user: User;
};

export const ProductUser: React.FC<Props> = ({ user }) => (
  <td
    data-cy="ProductUser"
    className={cn({
      'has-text-link': user.sex === 'm',
      'has-text-danger': user.sex === 'f',
    })}
  >
    {user.name}
  </td>
);
