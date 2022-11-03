import React from 'react';
import cn from 'classnames';

import { User } from '../../react-app-env';

interface Props {
  users: User[];
  currentUserId: number;
  setCurrentUserId: React.Dispatch<React.SetStateAction<number>>;
}

export const UserFilter: React.FC<Props> = ({
  users,
  currentUserId,
  setCurrentUserId,
}) => (
  <p className="panel-tabs has-text-weight-bold">
    <a
      data-cy="FilterAllUsers"
      href="#/"
      onClick={() => setCurrentUserId(0)}
      className={cn({ 'is-active': currentUserId === 0 })}
    >
      All
    </a>

    {users.map(({ name, id }) => (
      <a
        data-cy="FilterUser"
        href="#/"
        onClick={() => setCurrentUserId(id)}
        className={cn({ 'is-active': id === currentUserId })}
        key={id}
      >
        {name}
      </a>
    ))}
  </p>
);
