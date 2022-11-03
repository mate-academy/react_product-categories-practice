import React, { useState } from 'react';
import classNames from 'classnames';
import { Product } from './types/Product';
import { Category } from './types/Category';
import { User } from './types/User';
import './App.scss';

import productsFromServer from './api/products';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';

function getCategory(categoryId: number): Category | null {
  const foundCategory = categoriesFromServer
    .find(category => category.id === categoryId);

  return foundCategory || null;
}

function getUser(categoryId: number): User | null {
  const userId = getCategory(categoryId)?.ownerId;

  const foundedUser = usersFromServer
    .find(user => user?.id === userId);

  return foundedUser || null;
}

const productsWithOuterProps = productsFromServer.map(product => ({
  ...product,
  category: getCategory(product.categoryId),
  userName: getUser(product.categoryId)?.name,
  userSex: getUser(product.categoryId)?.sex,
}));

export const App: React.FC = () => {
  const [products, setProducts] = useState(productsWithOuterProps);
  const [query, setQuery] = useState('');

  const productList = productsWithOuterProps
    .filter(i => {
      return i.name.toLowerCase().includes(query.toLowerCase())
        || i.id.toString().includes(query);
    })
    .map(product => (
      <tr data-cy="Product">
        <td className="has-text-weight-bold" data-cy="ProductId">
          {product.id}
        </td>

        <td data-cy="ProductName">{product.name}</td>
        <td data-cy="ProductCategory">
          {`${product.category?.icon} - ${product.category?.title}`}
        </td>

        <td
          data-cy="ProductUser"
          className={classNames(
            { 'has-text-link': product.userSex === 'm' },
            { 'has-text-success': product.userSex === 'f' },
          )}
        >
          {product.userName}
        </td>
      </tr>
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
              >
                All
              </a>

              <a
                data-cy="FilterUser"
                href="#/"
              >
                User 1
              </a>

              <a
                data-cy="FilterUser"
                href="#/"
                className="is-active"
              >
                User 2
              </a>

              <a
                data-cy="FilterUser"
                href="#/"
              >
                User 3
              </a>
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

              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!productList.length && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

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
              {productList.length > 0 && productList}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
