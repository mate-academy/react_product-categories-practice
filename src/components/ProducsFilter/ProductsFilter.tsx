import { FC, useState, ChangeEvent } from 'react';
import cn from 'classnames';
import usersFromServer from '../../api/users';

type Props = {
  handleUserFilter: (userId: number) => void;
  handleQueryFilter: (query: string) => void
};

export const ProductsFilter: FC<Props> = ({
  handleUserFilter,
  handleQueryFilter,
}) => {
  const [selectedUser, setSelectedUser] = useState(0);
  const [query, setQuery] = useState('');

  const handleSelection = (id: number) => {
    setSelectedUser(id);
    handleUserFilter(id);
  };

  const handleRessetAll = () => {
    setQuery('');
    setSelectedUser(0);
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    handleQueryFilter(value);
  };

  const ressetQuery = () => {
    setQuery('');
  };

  return (
    <div className="block">
      <nav className="panel">
        <p className="panel-heading">Filters</p>

        <p className="panel-tabs has-text-weight-bold">
          <a
            data-cy="FilterAllUsers"
            href="#/"
            onClick={() => handleSelection(0)}
            className={cn({
              'is-active': selectedUser === 0,
            })}
          >
            All
          </a>

          {usersFromServer.map(({ id, name }) => (
            <a
              data-cy="FilterUser"
              href="#/"
              key={id}
              className={cn({
                'is-active': selectedUser === id,
              })}
              onClick={() => handleSelection(id)}
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
              placeholder="Search..."
              value={query}
              onChange={handleInput}
            />

            <span className="icon is-left">
              <i className="fas fa-search" aria-hidden="true" />
            </span>

            {query && (
              <span className="icon is-right">
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                <button
                  data-cy="ClearButton"
                  type="button"
                  className="delete"
                  onClick={ressetQuery}
                />
              </span>
            )}
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
            onClick={handleRessetAll}

          >
            Reset all filters
          </a>
        </div>
      </nav>
    </div>
  );
};
