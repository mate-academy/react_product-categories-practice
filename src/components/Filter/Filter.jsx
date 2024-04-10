import React from 'react';

export const Filter = ({
  users,
  selectedUser,
  setSelectedUser,
  selectedProduct,
  setSelectedProduct,
  categoryList,
  selectedCategories,
  setSelectedCategories,
}) => {
  const selectedCount = selectedCategories.reduce(
    (count, category) => (category.isSelected ? count + 1 : count),
    0,
  );

  const handleUser = v => {
    setSelectedUser(v);
  };

  const handleInput = v => {
    setSelectedProduct(v);
  };

  const handleCategoryChange = categoryId => {
    if (selectedCount === categoryList.length) {
      setSelectedCategories(prevSelectedCats =>
        prevSelectedCats.map(selectedCategory => ({
          ...selectedCategory,
          isSelected: selectedCategory.id === categoryId,
        })),
      );
    } else {
      setSelectedCategories(prevSelectedCategories =>
        prevSelectedCategories.map(selectedCategory =>
          selectedCategory.id !== categoryId
            ? selectedCategory
            : { ...selectedCategory, isSelected: !selectedCategory.isSelected },
        ),
      );
    }
  };

  return (
    <nav className="panel">
      <p className="panel-heading">Filters</p>

      <p className="panel-tabs has-text-weight-bold">
        <a
          data-cy="FilterAllUsers"
          href="#/"
          className={!selectedUser ? 'is-active' : ''}
          onClick={() => {
            setSelectedUser(null);
          }}
        >
          All
        </a>

        {users.map(user => (
          <a
            data-cy="FilterUser"
            href="#/"
            className={selectedUser === user.name ? 'is-active' : ''}
            onClick={() => {
              handleUser(user.name);
            }}
            key={user.id}
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

      <div className="panel-block is-flex-wrap-wrap">
        <a
          href="#/"
          data-cy="AllCategories"
          className={`button  mr-6 is-outlined" ${
            categoryList.length === selectedCount ? 'is-success' : ''
          }`}
          onClick={() => {
            setSelectedCategories(
              categoryList.map(cat => ({
                ...cat,
                isSelected: true,
              })),
            );
          }}
        >
          All
        </a>

        {categoryList.map(allCat => (
          <a
            data-cy="Category"
            className={`button mr-2 my-1 ${
              categoryList.length !== selectedCount &&
              selectedCategories.find(selCat => selCat.id === allCat.id)
                .isSelected
                ? 'is-info'
                : ''
            }`}
            href="#/"
            onClick={() => {
              handleCategoryChange(allCat.id);
            }}
            key={allCat.id}
          >
            {allCat.title}
          </a>
        ))}
      </div>

      <div className="panel-block">
        <a
          data-cy="ResetAllButton"
          href="#/"
          className="button is-link is-outlined is-fullwidth"
          onClick={() => {
            setSelectedUser(null);
            setSelectedProduct('');
            setSelectedCategories(
              categoryList.map(cat => ({
                id: cat.id,
                isSelected: true,
              })),
            );
          }}
        >
          Reset all filters
        </a>
      </div>
    </nav>
  );
};
