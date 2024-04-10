import React from 'react';
import { useMemo } from 'react';
import { SearchBar } from '../SearchBar/SearchBar';

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
  const selectedCount = useMemo(() => {
    return selectedCategories.reduce(
      (count, category) => (category.isSelected ? count + 1 : count),
      0,
    );
  }, [selectedCategories]);

  const handleUser = v => {
    setSelectedUser(v);
  };

  const handleInput = v => {
    setSelectedProduct(v);
  };

  const handleCategoryChange = categoryId => {
    setSelectedCategories(prevSelectedCategories =>
      prevSelectedCategories.map(selectedCategory =>
        selectedCategory.id !== categoryId
          ? selectedCategory
          : { ...selectedCategory, isSelected: !selectedCategory.isSelected },
      ),
    );
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
      <SearchBar
        handleInput={handleInput}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />
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
