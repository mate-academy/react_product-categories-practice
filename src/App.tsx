import React, { useState } from 'react';
import './App.scss';

import classNames from 'classnames';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

import { productsWithCategorieAndUser } from './types/ProductWithCategoryAndUser';

const productsWithCategories = productsFromServer.map(product => ({
  ...product,
  category: categoriesFromServer.find(category => category.id === product.categoryId),
}));

const productsWithCategoriesAndUsers = productsWithCategories.map(product => ({
  ...product,
  user: usersFromServer.find(user => product.category?.ownerId === user.id),
}));

export const App: React.FC = () => {
  const [filteredByUser, setFilteredByUser] = useState('All');
  const [products, setProducts] = useState<productsWithCategorieAndUser[]>(productsWithCategoriesAndUsers);
  const [query, setQuery] = useState('');
  const filterProductsByUser = products.filter(product => {
    if (filteredByUser === 'All') {
      return product;
    }

    return product.user?.name === filteredByUser;
  });

  const searchProducts = filterProductsByUser.filter(product => {
    const doesTitleMatch = product.name.toLowerCase()
      .includes(query.toLowerCase());

    return doesTitleMatch;
  });

  const resetAllFilters = () => {
    setProducts(productsWithCategoriesAndUsers);
    setQuery('');
    setFilteredByUser('All');
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
                  'is-active': filteredByUser === 'All',
                })}
                onClick={() => setFilteredByUser('All')}
              >
                All
              </a>
              {usersFromServer.map(users => (
                <a
                  key={users.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({
                    'is-active': filteredByUser === users.name,
                  })}
                  onClick={() => setFilteredByUser(users.name)}
                >
                  {users.name}
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
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
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
              >
                All
              </a>

              {categoriesFromServer.map(categories => (
                <a
                  key={categories.id}
                  data-cy="Category"
                  className="button mr-2 my-1"
                  // className="button mr-2 my-1 is-info"
                  href="#/"
                >
                  {categories.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">

          {searchProducts.length !== 0 && (
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
                {searchProducts.map(product => (
                  <tr
                    data-cy="Product"
                    key={product.id}
                  >
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
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
          {searchProducts.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
