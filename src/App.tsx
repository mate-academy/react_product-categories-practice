import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';
import { ProductWithCategory } from './types';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

const getCategory = (id: number) => {
  return categoriesFromServer.find(category => category.id === id) || null;
};

const getUser = (id: number) => {
  const category = getCategory(id);

  return usersFromServer.find(user => user.id === category?.ownerId) || null;
};

const prepareProducts = () => (
  productsFromServer.map(product => ({
    ...product,
    category: getCategory(product.categoryId),
    user: getUser(product.categoryId),
  }))
);

export const App: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [query, setQuery] = useState('');

  const isQueryIncludes = (value: string) => {
    return value.toUpperCase().includes(query.toUpperCase());
  };

  const preparedProducts: ProductWithCategory[] = prepareProducts()
    .filter(product => (
      selectedUserId
        ? product.user?.id === selectedUserId && isQueryIncludes(product.name)
        : isQueryIncludes(product.name)
    ));

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
                onClick={() => setSelectedUserId(0)}
                className={cn(
                  { 'is-active': selectedUserId === 0 },
                )}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={cn(
                    { 'is-active': selectedUserId === user.id },
                  )}
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
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    onClick={() => setQuery('')}
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                onClick={() => {
                  setSelectedCategory(0);
                }}
                className={cn('button mr-6', {
                  'is-success is-outlined': selectedCategory === 0,
                })}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  onClick={() => {
                    setSelectedCategory(category.id);
                  }}
                  className={cn('button mr-2 my-1', {
                    'is-success is-outlined': selectedCategory === category.id,
                  })}
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
                onClick={() => {
                  setQuery('');
                  setSelectedUserId(0);
                  setSelectedCategory(0);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {preparedProducts.length > 0
            ? (
              <table
                data-cy="ProductTable"
                className="table is-striped is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        ID

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Product

                        <a href="#/">
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className="fas fa-sort-down"
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Category

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort-up" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {preparedProducts.map(product => (
                    <tr data-cy="Product" key={product.id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="ProductCategory">
                        {`${product.category?.icon} - ${product.category?.title}`}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={cn(
                          {
                            'has-text-link': product.user?.sex === 'm',
                            'has-text-danger': product.user?.sex === 'f',
                          },
                        )}
                      >
                        {product.user?.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )

            : (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )}
        </div>
      </div>
    </div>
  );
};
