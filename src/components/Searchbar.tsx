import React from 'react';

type Props = {
  query: string,
  setQuery: (value: React.SetStateAction<string>) => void,
};

export const Searchbar: React.FC<Props> = ({
  query,
  setQuery,
}) => {
  return (
    <div className="panel-block">
      <p className="control has-icons-left has-icons-right">
        <input
          data-cy="SearchField"
          type="text"
          className="input"
          placeholder="Search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
        />

        <span className="icon is-left">
          <i className="fas fa-search" aria-hidden="true" />
        </span>

        {query.length > 0 && (
          <span className="icon is-right">
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button
              data-cy="ClearButton"
              type="button"
              className="delete"
              onClick={() => {
                setQuery('');
              }}
            />
          </span>
        )}
      </p>
    </div>
  );
};
