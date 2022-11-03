import React from 'react';
import classNames from 'classnames';
import usersFromServer from '../api/users';
import categoriesFromServer from '../api/categories';

type Props = {
  query: string
  setQuery: (input: string) => void
  selectedUser: number
  setSelectedUser: (input: number) => void
  resetFilters: () => void
};

export const ProductFilter: React.FC<Props> = ({
  query,
  setQuery,
  selectedUser,
  setSelectedUser,
  resetFilters,
}) => {
  return (
    <div className="block">
      <nav className="panel">
        <p className="panel-heading">Filters</p>

        <p className="panel-tabs has-text-weight-bold">
          <a
            data-cy="FilterAllUsers"
            href="#/"
            className={classNames({
              'is-active': !selectedUser,
            })}
            onClick={() => setSelectedUser(0)}
          >
            All
          </a>

          {usersFromServer.map(({ id, name }) => (
            <a
              data-cy="FilterUser"
              href="#/"
              key={id}
              className={classNames({
                'is-active': selectedUser === id,
              })}
              onClick={() => setSelectedUser(id)}
            >
              {name}
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
              onChange={(event) => setQuery(event.target.value)}
            />

            <span className="icon is-left">
              <i className="fas fa-search" aria-hidden="true" />
            </span>

            <span className="icon is-right">
              {query && (
                <button
                  data-cy="ClearButton"
                  type="button"
                  className="delete"
                  aria-hidden
                  onClick={() => setQuery('')}
                />
              )}
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

          {categoriesFromServer.map(({ id, title }) => (
            <a
              key={id}
              className="button mr-2 my-1"
              href="#/"
            >
              {title}
            </a>
          ))}
        </div>
        <div className="panel-block">
          <a
            data-cy="ResetAllButton"
            href="#/"
            className="button is-link is-outlined is-fullwidth"
            onClick={resetFilters}
          >
            Reset all filters
          </a>
        </div>
      </nav>
    </div>
  );
};
