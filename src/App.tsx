import React, { useState } from 'react';
import classNames from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';
import { Category, User } from './react-app-env';

type GetCategory = (id: number) => Category | null;

const getCategorie: GetCategory = (id) => {
  const foundCategory = categoriesFromServer.find(category => (
    category.id === id
  ));

  return foundCategory || null;
};

type GetUser = (id: number) => User | null;

const getUser: GetUser = (id) => {
  const foundUser = usersFromServer.find((user) => user.id === id);

  return foundUser || null;
};

const prepearedProducts = productsFromServer.map((product) => ({
  ...product,
  category: getCategorie(product.categoryId),
}))
  .map(product => ({
    ...product,
    user: product.category ? getUser(product.category.ownerId) : null,
  }));

export const App: React.FC = () => {
  const [filterByUser, setFilterByUser] = useState('');
  const [query, setQuery] = useState('');

  const filtredProducts = prepearedProducts.filter(product => {
    if (filterByUser === '') {
      return product;
    }

    return product.user?.name === filterByUser;
  })
    .filter(product => {
      const lowerCasedName = product.name.toLowerCase();
      const lowerCasedQuery = query.toLowerCase();

      return lowerCasedName.includes(lowerCasedQuery);
    });

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const clearInput = () => setQuery('');

  const reset = () => {
    setFilterByUser('');
    clearInput();
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
                className={classNames({
                  'is-active': filterByUser === '',
                })}
                onClick={(event) => {
                  event.preventDefault();
                  setFilterByUser('');
                }}
              >
                All
              </a>

              {usersFromServer.map((user: User) => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({
                    'is-active': filterByUser === user.name,
                  })}
                  key={user.id}
                  onClick={(event) => {
                    event.preventDefault();
                    setFilterByUser(user.name);
                  }}
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
                  onChange={handleInput}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      aria-label="Clear input"
                      type="button"
                      className="delete"
                      onClick={clearInput}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={reset}

              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="panel-block is-flex-wrap-wrap">
          <a
            href="#/"
            data-cy="AllCategories"
            className="button is-success mr-6 is-outlined"
          >
            All
          </a>

          {categoriesFromServer.map(category => (
            <a
              data-cy="Category"
              className="button mr-2 my-1 is-info"
              href="#/"
              key={category.id}
            >
              {category.title}
            </a>
          ))}
        </div>

        <div className="box table-container">
          {!filtredProducts.length
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            ) : (
              <table
                data-cy="ProductTable"
                className="table is-striped is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        ID
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Product
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Category
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filtredProducts.map(product => (
                    <tr data-cy="Product" key={product.id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">
                        {product.name}
                      </td>

                      <td data-cy="ProductCategory">
                        {`${product.category?.icon} - ${product.category?.title}`}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={classNames({
                          'has-text-link': product.user?.sex === 'm',
                          'has-text-danger': product.user?.sex === 'f',
                        })}
                      >
                        {product.user?.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

        </div>
      </div>
    </div>
  );
};
