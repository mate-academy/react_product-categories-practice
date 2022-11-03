import React, { useState } from 'react';
import classNames from 'classnames';
import './App.scss';
import {
  Category,
  Product,
  ProductWithCategory,
  User,
} from './react-app-env';
import { Products } from './components/Products';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

type CategoryById = (categoryId: number) => Category | null;
type UserById = (userId: number) => User | null;

const getCategoryById: CategoryById = (id) => {
  return categoriesFromServer.find(category => category.id === id) || null;
};

const getUserById: UserById = (id) => {
  return usersFromServer.find(user => user.id === id) || null;
};

const productsWithCategories = productsFromServer
  .map((product: Product) => ({
    ...product,
    category: getCategoryById(product.categoryId),
  }))
  .map(product => ({
    ...product,
    user: product.category ? getUserById(product.category.ownerId) : null,
  }));

export const App: React.FC = () => {
  const [products] = useState<ProductWithCategory[]>(productsWithCategories);
  const [userForFilter, setUserForFilter] = useState<string>('');
  const [query, setQuery] = useState('');

  const filtredProducts = products.filter(product => {
    if (!userForFilter) {
      return product;
    }

    return product.user?.name === userForFilter;
  })
    .filter(product => {
      const filterName = product.name.toLowerCase();
      const filterQuery = query.toLowerCase();

      return filterName.includes(filterQuery);
    });

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const clearInput = () => setQuery('');

  const resetFilters = () => {
    setUserForFilter('');
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
                  'is-active': !userForFilter,
                })}
                onClick={(event) => {
                  event.preventDefault();
                  setUserForFilter('');
                }}
              >
                All
              </a>

              {usersFromServer.map((user: User) => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({
                    'is-active': userForFilter === user.name,
                  })}
                  key={user.id}
                  onClick={(event) => {
                    event.preventDefault();
                    setUserForFilter(user.name);
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
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
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
                onClick={resetFilters}
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
                    <Products product={product} key={product.id} />
                  ))}

                  {/* <tr data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      2
                    </td>

                    <td data-cy="ProductName">Bread</td>
                    <td data-cy="ProductCategory">🍞 - Grocery</td>

                    <td
                      data-cy="ProductUser"
                      className="has-text-danger"
                    >
                      Anna
                    </td>
                  </tr>

                  <tr data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      3
                    </td>

                    <td data-cy="ProductName">iPhone</td>
                    <td data-cy="ProductCategory">💻 - Electronics</td>

                    <td
                      data-cy="ProductUser"
                      className="has-text-link"
                    >
                      Roma
                    </td>
                  </tr> */}
                </tbody>
              </table>
            )}
        </div>
      </div>
    </div>
  );
};
