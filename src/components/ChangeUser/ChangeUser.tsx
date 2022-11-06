import React, { useCallback } from 'react';
import classNames from 'classnames';
import { User } from '../../types/user';

interface Props {
  users: User[],
  selectedUserId: number,
  setSelectedUserId: (userId: number) => void,
}

export const ChangeUser: React.FC<Props> = ({
  users,
  selectedUserId,
  setSelectedUserId,
}) => {
  const handleUserChange = useCallback((userId: number) => {
    if (selectedUserId !== userId) {
      setSelectedUserId(userId);
    }
  }, [selectedUserId]);

  return (
    <p className="panel-tabs has-text-weight-bold">
      <a
        data-cy="FilterAllUsers"
        href="#/"
        className={classNames({
          'is-active': selectedUserId === 0,
        })}
        onClick={() => handleUserChange(0)}
      >
        All
      </a>

      {users.map(user => {
        const {
          id,
          name,
        } = user;

        return (
          <a
            data-cy="FilterUser"
            href="#/"
            key={id}
            className={classNames({
              'is-active': selectedUserId === id,
            })}
            onClick={() => handleUserChange(id)}
          >
            {name}
          </a>
        );
      })}
    </p>
  );
};
