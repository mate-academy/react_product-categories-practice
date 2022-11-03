import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';
import { CategoryWithUser, ProductWithCategory } from './react-app-env';
import { ProductList } from './components';

const getUserById = (userId: number) => {
  const foundUser = usersFromServer.find(user => user.id === userId);

  return foundUser || null;
};

const categoryWithUser: CategoryWithUser[] = categoriesFromServer
  .map(category => ({
    ...category,
    user: getUserById(category.ownerId),
  }));

const getCategoryById = (categoryId: number) => {
  const foundCategory = categoryWithUser
    .find(category => category.id === categoryId);

  return foundCategory || null;
};

const productWithCategory: ProductWithCategory[] = productsFromServer
  .map(product => ({
    ...product,
    category: getCategoryById(product.categoryId),
  }));

export function getVisibleProducts(
  userId: number,
  query: string,
  categoryId: number,
) {
  let visibleProducts = productWithCategory;

  if (userId > 0) {
    visibleProducts = visibleProducts
      .filter(product => product.category?.ownerId === userId);
  }

  if (query.length) {
    visibleProducts = visibleProducts
      .filter(
        product => product.name.toLowerCase().includes(query.toLowerCase()),
      );
  }

  if (categoryId > 0) {
    visibleProducts = visibleProducts
      .filter(product => product.categoryId === categoryId);
  }

  return visibleProducts;
}

export const App: React.FC = () => {
  const [userId, setUserId] = useState(0);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState(0);

  const visibleProducts = getVisibleProducts(userId, query, categoryId);

  const handleResetAllFilters = () => {
    setUserId(0);
    setQuery('');
    setCategoryId(0);
  };

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
                className={classNames({ 'is-active': userId === 0 })}
                onClick={() => setUserId(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({ 'is-active': userId === user.id })}
                  onClick={() => setUserId(user.id)}
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
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
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
                      onClick={() => setQuery('')}
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
                onClick={() => setCategoryId(0)}
              >
                All
              </a>
              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={classNames(
                    'button mr-2 my-1',
                    {
                      'is-info': category.id === categoryId,
                    },
                  )}
                  onClick={() => setCategoryId(category.id)}
                  href="#/"
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <ProductList products={visibleProducts} />
      </div>
    </div>
  );
};
