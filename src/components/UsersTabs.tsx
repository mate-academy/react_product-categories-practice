import classNames from 'classnames';
import React from 'react';

import usersFromServer from '../api/users';

type Props = {
  filterByUser: number,
  setFilterByUser: (value: React.SetStateAction<number>) => void,
};

export const UsersTabs: React.FC<Props> = ({
  filterByUser,
  setFilterByUser,
}) => {
  return (
    <p className="panel-tabs has-text-weight-bold">
      <a
        data-cy="FilterAllUsers"
        href="#/"
        className={classNames({
          'is-active': filterByUser === 0,
        })}
        onClick={() => setFilterByUser(0)}
      >
        All
      </a>

      {usersFromServer.map(user => {
        const { id, name } = user;

        return (
          <a
            data-cy="FilterUser"
            href="#/"
            key={id}
            className={classNames({
              'is-active': filterByUser === id,
            })}
            onClick={() => {
              setFilterByUser(id);
            }}
          >
            {name}
          </a>
        );
      })}
    </p>
  );
};
