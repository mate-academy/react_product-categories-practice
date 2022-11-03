import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

import { Category } from './types/Category';
import { User } from './types/User';
import { FullProduct } from './types/FullProduct';
import { ProductTable } from './components/ProductTable';
import { FilterPanel } from './components/FIlterPanel';

type GetCategory = (categoryId: number) => Category | null;
const getCategorie: GetCategory = (categoryId) => {
  const foundCategory = categoriesFromServer.find(category => (
    category.id === categoryId
  ));

  return foundCategory || null;
};

type GetUser = (userId: number) => User | null;
const getUser: GetUser = (userId) => {
  const foundUser = usersFromServer.find((user) => user.id === userId);

  return foundUser || null;
};

const fullProductsList = productsFromServer.map((product) => ({
  ...product,
  category: getCategorie(product.categoryId),
}))
  .map(product => ({
    ...product,
    user: product.category ? getUser(product.category.ownerId) : null,
  }));

export const App: React.FC = () => {
  const [products] = useState<FullProduct[]>(fullProductsList);
  const [userToFilter, setUserToFilter] = useState<string>('');
  const [query, setQuery] = useState('');
  const [categoriesToFilter, setCategoriesToFilter] = useState<string[]>([]);

  const filtredProducts = products
    .filter(product => {
      if (userToFilter === '') {
        return product;
      }

      return product.user?.name === userToFilter;
    })
    .filter(product => {
      const lowerCasedName = product.name.toLowerCase();
      const lowerCasedQuery = query.toLowerCase();

      return lowerCasedName.includes(lowerCasedQuery);
    })
    .filter(product => {
      if (categoriesToFilter.length === 0) {
        return product;
      }

      if (product.category) {
        return categoriesToFilter.includes(product.category.title);
      }

      return product;
    });

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const clearInput = () => setQuery('');

  const resetFilters = () => {
    setUserToFilter('');
    clearInput();
    setCategoriesToFilter([]);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <FilterPanel
          setUserToFilter={setUserToFilter}
          users={usersFromServer}
          userToFilter={userToFilter}
          handleInput={handleInput}
          query={query}
          clearInput={clearInput}
          resetFilters={resetFilters}
          categories={categoriesFromServer}
          setCategoriesToFilter={setCategoriesToFilter}
          categoriesToFilter={categoriesToFilter}
        />

        <div className="box table-container">
          {!filtredProducts.length
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            ) : (
              <ProductTable products={filtredProducts} />
            )}
        </div>
      </div>
    </div>
  );
};
