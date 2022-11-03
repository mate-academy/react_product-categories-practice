import { FC, useState } from 'react';
import cn from 'classnames';
import { Users, Catigories } from '../../types';

type Props = {
  users: Users[],
  catigories: Catigories[],
  setSelectedUser: (value: Users | null) => void;
  selectedUser: Users | null;
  setQuery: (value: string) => void;
};

export const Panel: FC<Props> = ({
  users,
  catigories,
  setSelectedUser,
  selectedUser,
  setQuery,
}) => {
  const [input, setInput] = useState('');

  return (
    <nav className="panel">
      <p className="panel-heading">Filters</p>

      <p className="panel-tabs has-text-weight-bold">
        <a
          data-cy="FilterAllUsers"
          href="#/"
          className={cn({ 'is-active': selectedUser === null })}
          onClick={() => setSelectedUser(null)}
        >
          All
        </a>

        {users && (
          users.map(user => {
            return (
              <a
                data-cy="FilterUser"
                href="#/"
                className={cn({
                  'is-active': selectedUser?.name === user.name,
                })}
                onClick={() => setSelectedUser(user)}
                key={user.id}
              >
                {user.name}
              </a>
            );
          })
        )}
      </p>

      <div className="panel-block">
        <p className="control has-icons-left has-icons-right">
          <input
            data-cy="SearchField"
            type="text"
            className="input"
            placeholder="Search"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setQuery(event.target.value);
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

        {catigories && (
          catigories.map(category => (
            <a
              data-cy="Category"
              className="button mr-2 my-1 is-info"
              href="#/"
              key={category.id}
            >
              {category.title}
            </a>
          ))
        )}
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
  );
};
