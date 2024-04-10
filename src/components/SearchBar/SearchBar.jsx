export const SearchBar = ({
  handleInput,
  selectedProduct,
  setSelectedProduct,
}) => {
  return (
    <>
      <div className="panel-block">
        <p className="control has-icons-left has-icons-right">
          <input
            data-cy="SearchField"
            type="text"
            className="input"
            placeholder="Search"
            value={selectedProduct}
            onChange={e => {
              handleInput(e.target.value);
            }}
          />

          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true" />
          </span>

          {selectedProduct && (
            <span className="icon is-right">
              {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
              <button
                data-cy="ClearButton"
                type="button"
                className="delete"
                onClick={() => {
                  setSelectedProduct('');
                }}
              />
            </span>
          )}
        </p>
      </div>
    </>
  );
};
