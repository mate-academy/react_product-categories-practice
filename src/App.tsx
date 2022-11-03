import React, { useState } from 'react';
import cn from 'classnames';

import './App.scss';
import { Category } from './types/Categorie';
import { PreparedProduct } from './types/PreparedProduct';
import { Product } from './types/Product';
import { User } from './types/User';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

const prepareProducts = (
  products: Product[], categories: Category[], users: User[],
): PreparedProduct[] => {
  let findedUser: User | null;

  return products.map(product => ({
    ...product,
    category: categories.find(category => {
      findedUser = users.find(user => user.id === category.ownerId) || null;

      return category.id === product.categoryId;
    }) || null,
    user: findedUser,
  }));
};

const preparedProducts = prepareProducts(
  productsFromServer, categoriesFromServer, usersFromServer,
);

export const App: React.FC = () => {
  const [products, setProducts] = useState<PreparedProduct[]>(preparedProducts);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [query, setQuery] = useState('');

  const selectAllHandler = () => setSelectedUserId(0);

  const selectUserIdHandler = (id: number) => setSelectedUserId(id);

  const filteredProducts = selectedUserId
    ? products.filter(product => product.user?.id === selectedUserId)
    : products;

  const getVisibleProducts = (queryToFilter: string) => (
    filteredProducts.filter(product => (
      product.name.toLowerCase().includes(queryToFilter.toLowerCase())
    ))
  );

  const visibleProducts = getVisibleProducts(query);

  const resetAllHandler = () => {
    setProducts(preparedProducts);
    setQuery('');
    setSelectedUserId(0);
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
                className={cn('', { 'is-active': selectedUserId === 0 })}
                onClick={selectAllHandler}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={cn('', {
                    'is-active': user.id === selectedUserId,
                  })}
                  onClick={() => selectUserIdHandler(user.id)}
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

                {query && (
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
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetAllHandler}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length ? (
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
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
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
                {visibleProducts.map(({
                  id, name, category, user,
                }) => (
                  <tr data-cy="Product" key={id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {id}
                    </td>

                    <td data-cy="ProductName">{name}</td>
                    <td data-cy="ProductCategory">{`${category?.icon} - ${category?.title}`}</td>

                    <td
                      data-cy="ProductUser"
                      className={cn({
                        'has-text-link': user?.sex === 'm',
                        'has-text-danger': user?.sex === 'f',
                      })}
                    >
                      {user?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
