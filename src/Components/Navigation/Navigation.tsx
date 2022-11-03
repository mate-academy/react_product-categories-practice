import React, { FC, useContext } from 'react';
import { AppContext } from '../AppProvider';
import { CategorySerch } from '../CategorySearch';
import { UserFilters } from '../UserFilters';

export const Navigation: FC = () => {
  const {
    query,
    setQuery,
    setChoosenCategories,
    setChoosenUser,
  } = useContext(AppContext);
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const cleanInput = () => {
    setQuery('');
  };

  const resetFilters = () => {
    setQuery('');
    setChoosenCategories(['all']);
    setChoosenUser('all');
  };

  return (
    <nav className="panel">
      <p className="panel-heading">Filters</p>

      <UserFilters />

      {/* #region search bar */}
      <div className="panel-block">
        <p className="control has-icons-left has-icons-right">
          <input
            data-cy="SearchField"
            type="text"
            className="input"
            placeholder="Search"
            value={query}
            onChange={handleInput}
          />

          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true" />
          </span>

          {query && (
            <span className="icon is-right">
              <button
                aria-label="delete"
                data-cy="ClearButton"
                type="button"
                className="delete"
                onClick={cleanInput}
              />
            </span>
          )}
        </p>
      </div>

      <CategorySerch />

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
  );
};
