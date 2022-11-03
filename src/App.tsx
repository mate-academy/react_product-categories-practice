import React, { useEffect, useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

import { UserFilter } from './components/UserFilter';
import { SearchBar } from './components/SearchBar';
import { ProductsTable } from './components/ProductsTable';
import { CategoriesFilter } from './components/CategoriesFilter';
import { ResetButton } from './components/ResetButton';

import {
  Category,
  User,
  ProductComplete,
} from './react-app-env';

function getCategoryById(categoryId: number): Category | null {
  const category = categoriesFromServer.find(currentCategory => (
    currentCategory.id === categoryId
  ));

  return category || null;
}

function getUserById(userId: number): User | null {
  const user = usersFromServer.find(currentUser => (
    currentUser.id === userId
  ));

  return user || null;
}

const preparedProducts: ProductComplete[] = productsFromServer
  .map(product => {
    const category = getCategoryById(product.categoryId);
    const user = category
      ? getUserById(category.ownerId)
      : null;

    return {
      ...product,
      category,
      user,
    };
  });

export const App: React.FC = () => {
  const [products, setProducts] = useState<ProductComplete[]>(preparedProducts);
  const [query, setQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [currentCategoryIds, setCurrentCategoryIds] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('');
  const [isSortReversed, setIsSortReversed] = useState(false);

  const handleResetAll = () => {
    setCurrentUserId(0);
    setQuery('');
    setCurrentCategoryIds([]);
  };

  const filterByUser = (
    productsToFilter: ProductComplete[],
    userId: number,
  ): ProductComplete[] => (userId === 0
    ? productsToFilter
    : productsToFilter.filter(product => (
      product.user?.id === userId
    ))
  );

  const filterByQuery = (
    productsToFilter: ProductComplete[],
  ): ProductComplete[] => (query.length
    ? productsToFilter.filter(({ name }) => {
      const loweredName = name.toLowerCase();
      const loweredQuery = query.toLowerCase();

      return loweredName.includes(loweredQuery);
    })
    : productsToFilter
  );

  const filterByCategories = (
    productsToFilter: ProductComplete[],
  ): ProductComplete[] => (currentCategoryIds.length
    ? productsToFilter.filter(({ categoryId }) => (
      currentCategoryIds.includes(categoryId)
    ))
    : productsToFilter
  );

  const filterProducts = () => {
    let filteredProducts = preparedProducts;

    filteredProducts = filterByUser(filteredProducts, currentUserId);
    filteredProducts = filterByQuery(filteredProducts);
    filteredProducts = filterByCategories(filteredProducts);

    setProducts(filteredProducts);
  };

  useEffect(() => {
    filterProducts();
  }, [query, currentUserId, currentCategoryIds]);

  const sortProducts = () => {
    const sortedProducts = [...products]
      .sort((firstProduct, secondProduct) => {
        switch (sortBy) {
          case 'ID':
            return firstProduct.id - secondProduct.id;

          case 'Product':
            return firstProduct.name.localeCompare(secondProduct.name);

          case 'Category':
            return firstProduct.categoryId - secondProduct.categoryId;

          case 'User':
            return (firstProduct.user?.name || '')
              .localeCompare(secondProduct.user?.name || '');

          default:
            return 0;
        }
      });

    return (isSortReversed)
      ? sortedProducts.reverse()
      : sortedProducts;
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <UserFilter
              users={usersFromServer}
              currentUserId={currentUserId}
              setCurrentUserId={setCurrentUserId}
            />

            <SearchBar query={query} setQuery={setQuery} />

            <CategoriesFilter
              categories={categoriesFromServer}
              currentCategoryIds={currentCategoryIds}
              setCurrentCategoryIds={setCurrentCategoryIds}
            />

            <ResetButton handleResetAll={handleResetAll} />
          </nav>
        </div>

        <div className="box table-container">
          {sortProducts().length > 0
            ? (
              <ProductsTable
                products={sortProducts()}
                sortBy={sortBy}
                setSortBy={setSortBy}
                isSortReversed={isSortReversed}
                setIsSortReversed={setIsSortReversed}
              />
            ) : (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )}
        </div>
      </div>
    </div>
  );
};
