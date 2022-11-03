import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import { FullProduct } from './react-app-env';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';
import { CategoriesList } from './Components/CategoriesList/CategoriesList';

const fullCatigories: FullProduct[] = productsFromServer
  .map(product => (
    {
      ...product,
      cattegories: categoriesFromServer
        .find(item => item.id === product.categoryId) || null,

      user: usersFromServer
        .find(person => person.id === categoriesFromServer
          .find(item => item.id === product.categoryId)?.ownerId
           || null) || null,
    }
  ));

export const App: React.FC = () => {
  const [products, setProducts] = useState<FullProduct[]>(fullCatigories);
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('All');

  const filterByQuery = () => {
    return products.filter(product => (
      product.name.toLowerCase().includes(query.toLowerCase())
      || product.cattegories?.title.toLowerCase().includes(query.toLowerCase())
      || product.user?.name.toLowerCase().includes(query.toLowerCase())
    ));
  };

  const filterByName = (userName: string) => {
    if (userName === 'All') {
      setSelectedUser('All');

      return setProducts(fullCatigories);
    }

    setSelectedUser(userName);

    const copyProduct = fullCatigories.filter(item => {
      return item.user?.name === userName;
    });

    return setProducts(copyProduct);
  };

  const filterByCategories = (categoriesId: number) => {
    if (categoriesId === 0) {
      return setProducts(fullCatigories);
    }

    const copyProduct = fullCatigories.filter(item => {
      return item.cattegories?.id === categoriesId;
    });

    return setProducts(copyProduct);
  };

  const resetFilter = () => {
    return setProducts(fullCatigories);
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
                  'is-active': selectedUser === 'All',
                })}
                onClick={() => filterByName('All')}
              >
                All
              </a>
              {
                usersFromServer.map(user => (
                  <a
                    data-cy="FilterUser"
                    href="#/"
                    className={classNames({
                      'is-active': selectedUser === user.name,
                    })}
                    onClick={() => filterByName(user.name)}
                  >
                    {user.name}
                  </a>
                ))
              }

              {/* <a
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
              </a> */}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {
                  query.length > 0 && (
                    <span className="icon is-right">
                      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                      <button
                        data-cy="ClearButton"
                        type="button"
                        className="delete"
                        onClick={() => {
                          setQuery('');
                        }}
                      />
                    </span>
                  )
                }
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => {
                  filterByCategories(0);
                }}
              >
                All
              </a>

              {
                categoriesFromServer.map(category => (
                  <a
                    data-cy="Category"
                    className="button mr-2 my-1 is-info"
                    href="#/"
                    onClick={() => {
                      filterByCategories(category.id);
                    }}
                  >
                    {`${category.title}`}
                  </a>
                ))
              }

              {/* <a
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
              </a> */}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetFilter}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {
            filterByQuery().length === 0
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
                              <i
                                data-cy="SortIcon"
                                className="fas fa-sort-up"
                              />
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

                  <CategoriesList products={filterByQuery()} />
                </table>
              )
          }

          {/* <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p> */}

          {/* <table
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
              <tr data-cy="Product">
                <td className="has-text-weight-bold" data-cy="ProductId">
                  1
                </td>

                <td data-cy="ProductName">Milk</td>
                <td data-cy="ProductCategory">🍺 - Drinks</td>

                <td
                  data-cy="ProductUser"
                  className="has-text-link"
                >
                  Max
                </td>
              </tr>

              <tr data-cy="Product">
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
              </tr>
            </tbody>
          </table> */}
        </div>
      </div>
    </div>
  );
};
