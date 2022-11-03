import React, { FC, useState } from 'react';
import cn from 'classnames';
import { User } from '../../types/User';

type Props = {
  users: User[];
  change: (id: number) => void;
  reset: () => void;
  changeQuery: (event: React.ChangeEvent<HTMLInputElement>) => void;
  query: string;
  resetQuery: () => void;
};

export const FilterBlock: FC<Props> = ({
  users,
  change,
  reset,
  changeQuery,
  query,
  resetQuery,
}) => {
  const [activeUser, setUser] = useState('all');

  return (
    <div className="block">
      <nav className="panel">
        <p className="panel-heading">Filters</p>

        <p className="panel-tabs has-text-weight-bold">
          <a
            className={cn({
              'is-active': activeUser === 'all',
            })}
            data-cy="FilterAllUsers"
            href="#/"
            onClick={() => {
              reset();
              setUser('all');
            }}
          >
            All
          </a>

          {/* eslint-disable-next-line @typescript-eslint/no-shadow */}
          {users.map(user => (
            <a
              key={user.id}
              data-cy="FilterUser"
              href="#/"
              onClick={() => {
                change(user.id);
                setUser(user.name);
              }}
              className={cn({
                'is-active': user.name === activeUser,
              })}
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
              onChange={event => {
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

          <a
            data-cy="Category"
            className="button mr-2 my-1 is-info"
            href="#/"
          >
            Category 1
          </a>

          <a
            data-cy="Category"
            className="button mr-2 my-1"
            href="#/"
          >
            Category 2
          </a>

          <a
            data-cy="Category"
            className="button mr-2 my-1 is-info"
            href="#/"
          >
            Category 3
          </a>
          <a
            data-cy="Category"
            className="button mr-2 my-1"
            href="#/"
          >
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
