import cn from 'classnames';
import React, { useState } from 'react';
import { User } from '../types/user';

type Props = {
  users: User[];
  filterByUser: (id: number) => void;
  query: string;
  changeQuery: (event: React.ChangeEvent<HTMLInputElement>) => void;
  resetQuery: () => void;
  reset: () => void;
};
export const Users: React.FC<Props> = ({
  users,
  filterByUser,
  query,
  changeQuery,
  resetQuery,
  reset,
}) => {
  const [selectedUser, setSelectedUser] = useState('all');

  return (
    <div className="block">
      <nav className="panel">
        <p className="panel-heading">Filters</p>
        <p className="panel-tabs has-text-weight-bold">
          <a
            data-cy="FilterAllUsers"
            href="#/"
            className={cn({ 'is-active': selectedUser === 'all' })}
            onClick={() => {
              reset();
              setSelectedUser('all');
            }}
          >
            All
          </a>

          {users.map((user) => (
            <a
              data-cy="FilterUser"
              href="#/"
              key={user.id}
              onClick={() => {
                filterByUser(user.id);
                setSelectedUser(user.name);
              }}
              className={cn({ 'is-active': selectedUser === user.name })}
            >
              {user.name}
            </a>
          ))}
        </p>

        <div className="panel-block">
          <p className="control has-icons-left has-icons-right">
            <input
              data-cy="SearchField"
              type="text"
              className="input"
              placeholder="Search"
              value={query}
              onChange={(event) => {
                changeQuery(event);
              }}
            />

            <span className="icon is-left">
              <i className="fas fa-search" aria-hidden="true" />
            </span>

            <span className="icon is-right">
              {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
              <button
                data-cy="ClearButton"
                type="button"
                className="delete"
                onClick={resetQuery}
              />
            </span>
          </p>
        </div>

        <div className="panel-block is-flex-wrap-wrap">
          <a
            href="#/"
            data-cy="AllCategories"
            className="button is-success mr-6 is-outlined"
          >
            All
          </a>

          <a data-cy="Category" className="button mr-2 my-1 is-info" href="#/">
            Category 1
          </a>

          <a data-cy="Category" className="button mr-2 my-1" href="#/">
            Category 2
          </a>

          <a data-cy="Category" className="button mr-2 my-1 is-info" href="#/">
            Category 3
          </a>
          <a data-cy="Category" className="button mr-2 my-1" href="#/">
            Category 4
          </a>
        </div>

        <div className="panel-block">
          <a
            data-cy="ResetAllButton"
            href="#/"
            className="button is-link is-outlined is-fullwidth"
          >
            Reset all filters
          </a>
        </div>
      </nav>
    </div>
  );
};
