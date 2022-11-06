import React, { useCallback, useEffect, useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

import { Product } from './types/product';

import { ProductTable } from './components/ProductTable';
import { ChangeUser } from './components/ChangeUser';
import { ChangeQuery } from './components/ChangeQuery';
import { ChangeCategory } from './components/ChangeCategory';
import { SortField } from './types/SortField';

const getUserById = (userId?: number) => {
  const foundUser = usersFromServer.find(user => user.id === userId);

  return foundUser || null;
};

const getCategoryById = (categoryId: number) => {
  const foundCategory = categoriesFromServer
    .find(category => category.id === categoryId);

  return foundCategory || null;
};

const products: Product[] = productsFromServer.map(product => {
  const category = getCategoryById(product.categoryId);
  const user = getUserById(category?.ownerId);

  return ({
    ...product,
    category,
    user,
  });
});

export const App: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>(products);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortField>(SortField.NONE);
  const [isReversed, setIsReversed] = useState(false);

  useEffect(() => {
    let productsCopy = [...products];

    if (selectedUserId !== 0) {
      productsCopy = productsCopy.filter(
        product => product.user?.id === selectedUserId,
      );
    }

    if (query) {
      productsCopy = productsCopy.filter(
        product => product.name.toLowerCase().includes(query.toLowerCase()),
      );
    }

    if (selectedCategoryIds.length !== 0) {
      productsCopy = productsCopy.filter(
        product => selectedCategoryIds.includes(product.categoryId),
      );
    }

    productsCopy.sort((p1, p2) => {
      switch (sortBy) {
        case SortField.ID:
          return p1.id - p2.id;
        case SortField.PRODUCT:
          return p1.name.localeCompare(p2.name);
        case SortField.USER: {
          const user1Name = p1.user?.name || '';
          const user2Name = p2.user?.name || '';

          return user1Name.localeCompare(user2Name);
        }

        case SortField.CATEGORY: {
          const category1Name = p1.category?.title || '';
          const category2Name = p2.category?.title || '';

          return category1Name.localeCompare(category2Name);
        }

        case SortField.NONE:
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
    query,
    selectedCategoryIds,
    sortBy,
  ]);

  const resetFilters = useCallback(() => {
    setSelectedUserId(0);
    setQuery('');
    setSelectedCategoryIds([]);
  }, []);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <ChangeUser
              users={usersFromServer}
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
            />

            <ChangeQuery
              query={query}
              setQuery={setQuery}
            />

            <ChangeCategory
              categories={categoriesFromServer}
              selectedCategoryIds={selectedCategoryIds}
              setSelectedCategoryIds={setSelectedCategoryIds}
            />

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
                sortBy={sortBy}
                setSortBy={setSortBy}
                isReversed={isReversed}
                setIsReversed={setIsReversed}
              />
            )}
        </div>
      </div>
    </div>
  );
};
