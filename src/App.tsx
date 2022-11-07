import React, { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';
import { Product, SortField } from './types';
import { ProductTable } from './components/ProductTable';

function getUserById(id?: number) {
  const user = usersFromServer.find(u => u.id === id);

  return user || null;
}

function getCategoryById(id: number) {
  const category = categoriesFromServer.find(c => c.id === id);

  return category || null;
}

const products: Product[] = productsFromServer.map(product => {
  const foundCategory = getCategoryById(product.categoryId);
  const user = getUserById(foundCategory?.ownerId);

  return ({
    ...product,
    category: foundCategory,
    user,
  });
});

// sortBy -> get some value = Name
// sortBy -> sort by === previousValue -> call reverse
// if no -> set sort by == new value && reset reverse
// sortBy -> sort by === previousValue -> reset

export const App: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>(products);
  const [productName, setProductName] = useState('');
  const [sortBy, setSortBy] = useState<SortField>(SortField.None);
  const [isReversed, setIsReversed] = useState(false);

  useEffect(() => {
    let productsCopy = [...products];

    if (selectedUserId !== 0) {
      productsCopy = productsCopy.filter(p => p.user?.id === selectedUserId);
    }

    if (productName) {
      productsCopy = productsCopy.filter(
        p => p.name.toLowerCase().includes(productName.toLowerCase()),
      );
    }

    if (selectedCategoryIds.length > 0) {
      productsCopy = productsCopy.filter(
        p => selectedCategoryIds.includes(p.categoryId),
      );
    }

    productsCopy.sort((p1, p2) => {
      switch (sortBy) {
        case SortField.ID:
          return p1.id - p2.id;
        case SortField.Product:
          return p1.name.localeCompare(p2.name);
        case SortField.User: {
          const user1Name = p1.user?.name || '';
          const user2Name = p2.user?.name || '';

          return user1Name.localeCompare(user2Name);
        }

        case SortField.Category: {
          const category1Name = p1.category?.title || '';
          const category2Name = p2.category?.title || '';

          return category1Name.localeCompare(category2Name);
        }

        case SortField.None:
        default:
          return 0;
      }
    });

    if (isReversed) {
      productsCopy.reverse();
    }

    setVisibleProducts(productsCopy);
  }, [
    selectedUserId,
    productName,
    selectedCategoryIds,
    sortBy,
    isReversed,
  ]);

  const handleUserChange = useCallback((userId: number) => {
    if (selectedUserId !== userId) {
      setSelectedUserId(userId);
    }
  }, [selectedUserId]);

  const handleNameChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setProductName(event.target.value);
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedUserId(0);
    setProductName('');
  }, []);

  const handleCategorySelect = useCallback((
    newCategoryId: number, isCategorySelected: boolean,
  ) => {
    if (isCategorySelected) {
      setSelectedCategoryIds(currentCategoryIds => currentCategoryIds.filter(
        categoryId => newCategoryId !== categoryId,
      ));
    } else {
      setSelectedCategoryIds(
        currentCategoryIds => [...currentCategoryIds, newCategoryId],
      );
    }
  }, [selectedCategoryIds]);

  const handleSortByChange = useCallback((newSortBy: SortField) => {
    if (newSortBy !== sortBy) {
      setSortBy(newSortBy);
      setIsReversed(false);
    } else if (!isReversed) {
      setIsReversed(true);
    } else {
      setSortBy(SortField.None);
      setIsReversed(false);
    }
  }, [sortBy, isReversed]);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({
                  'is-active': selectedUserId === 0,
                })}
                onClick={() => handleUserChange(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={cn({
                    'is-active': user.id === selectedUserId,
                  })}
                  onClick={() => handleUserChange(user.id)}
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
                  value={productName}
                  onChange={handleNameChange}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {productName && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setProductName('')}
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
                onClick={() => setSelectedCategoryIds([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => {
                const isCategorySelected = selectedCategoryIds.includes(
                  category.id,
                );

                return (
                  <a
                    key={category.id}
                    data-cy="Category"
                    className={cn('button mr-2 my-1', {
                      'is-info': isCategorySelected,
                    })}
                    href="#/"
                    onClick={() => {
                      handleCategorySelect(category.id, isCategorySelected);
                    }}
                  >
                    {category.title}
                  </a>
                );
              })}
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

        <div className="box table-container">
          {visibleProducts.length === 0
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )
            : (
              <ProductTable
                products={visibleProducts}
                handleSortByChange={handleSortByChange}
                sortBy={sortBy}
                isReversed={isReversed}
              />
            )}
        </div>
      </div>
    </div>
  );
};
