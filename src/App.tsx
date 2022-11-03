import React, { useState } from 'react';
import './App.scss';

import classNames from 'classnames';
import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';
import { Category, User, Product } from './react-app-env';

type FoundCategory = (categoryId: number) => Category | null;
const getCategory: FoundCategory = (categoryId) => (
  categoriesFromServer
    .find(category => category.id === categoryId) || null
);

type FoundUser = (userId: number) => User | null;
const getUser: FoundUser = (userId) => (
  usersFromServer
    .find((user) => user.id === userId) || null
);

const productsList = productsFromServer
  .map((product) => ({
    ...product,
    category: getCategory(product.categoryId),
  }))
  .map(product => ({
    ...product,
    user: product.category
      ? getUser(product.category.ownerId)
      : null,
  }));

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [userFilter, setUserFilter] = useState<string>('');
  const [products] = useState<Product[]>(productsList);

  const filtredProducts = products.filter(product => {
    if (userFilter === '') {
      return product;
    }

    return product.user?.name === userFilter;
  })
    .filter(product => {
      const lowerCasedName = product.name.toLowerCase();
      const lowerCasedQuery = query.toLowerCase();

      return lowerCasedName.includes(lowerCasedQuery);
    });

  const resetHandler = () => {
    setQuery('');
    setUserFilter('');
  };

  const clearButtonHandler = () => {
    setQuery('');
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
                  'is-active': userFilter === '',
                })}
                onClick={(e) => {
                  e.preventDefault();
                  setUserFilter('');
                }}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  href="#/"
                  onClick={(e) => {
                    e.preventDefault();
                    setUserFilter(user.name);
                  }}
                  className={classNames({
                    'is-active': userFilter === user.name,
                  })}
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

                <span className="icon is-right">
                  {query && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      aria-label="Clear"
                      onClick={clearButtonHandler}
                    />
                  )}
                </span>
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

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  href="#/"
                  className="button mr-2 my-1"
                  // className={classNames(
                  //   'button mr-2 my-1',
                  //   { 'is-info': chosenCategory },
                  // )}
                  // onClick={() => getCategory(category.id)}
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
                onClick={resetHandler}
              >
                Reset all filters
              </a>
            </div>
          </nav>
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
