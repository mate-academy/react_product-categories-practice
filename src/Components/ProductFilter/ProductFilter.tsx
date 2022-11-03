import React, { useState } from 'react';
import classNames from 'classnames';
import { User } from '../../types/user';
import users from '../../api/users';
import categories from '../../api/categories';

type Props = {
  onFilter: (user: User | null, query: string) => void;
};

export const ProductFilter: React.FC<Props> = ({ onFilter }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [query, setQuery] = useState('');

  const handleAllUsersClick = () => {
    setSelectedUser(null);
    onFilter(null, query);
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    onFilter(user, query);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onFilter(selectedUser, event.target.value);
  };

  const handleResetInputClick = () => {
    setQuery('');
    onFilter(selectedUser, '');
  };

  const handleResetAllClick = () => {
    setQuery('');
    setSelectedUser(null);
    onFilter(null, '');
  };

  return (
    <div className="block">
      <nav className="panel">
        <p className="panel-heading">Filters</p>

        <p className="panel-tabs has-text-weight-bold">
          <a
            data-cy="FilterAllUsers"
            href="#/"
            className={classNames({
              'is-active': selectedUser === null,
            })}
            onClick={handleAllUsersClick}
          >
            All
          </a>

          {users.map(user => (
            <a
              data-cy="FilterUser"
              key={user.id}
              href="#/"
              className={classNames({
                'is-active': selectedUser?.id === user.id,
              })}
              onClick={() => handleUserClick(user)}
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
              onChange={handleInputChange}
            />

            <span className="icon is-left">
              <i className="fas fa-search" aria-hidden="true" />
            </span>

            <span className="icon is-right">
              {query && (
                // eslint-disable-next-line jsx-a11y/control-has-associated-label
                <button
                  data-cy="ClearButton"
                  type="button"
                  className="delete"
                  onClick={handleResetInputClick}
                />
              )}
            </span>
          </p>
        </div>

        <div className="panel-block is-flex-wrap-wrap">
          <a
            href="#/"
            data-cy="AllCategories"
            className="button is-success mr-6"
          >
            All
          </a>

          {categories.map(categorie => (
            <a
              data-cy="Category"
              className="button mr-2 my-1"
              href="#/"
              key={categorie.id}
            >
              {categorie.title}
            </a>
          ))}
        </div>

        <div className="panel-block">
          <a
            data-cy="ResetAllButton"
            href="#/"
            className="button is-link is-outlined is-fullwidth"
            onClick={handleResetAllClick}
          >
            Reset all filters
          </a>
        </div>
      </nav>
    </div>
  );
};
