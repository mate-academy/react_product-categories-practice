import React, { useState } from 'react';
import './App.scss';

import classNames from 'classnames';
import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';
import { Product } from './types';

const getCategoryById = (categoryId: number) => {
  const foundedCategory = categoriesFromServer.find(
    category => category.id === categoryId,
  );

  return foundedCategory || null;
};

const getUserById = (userId: number | undefined) => {
  const foundedUser = usersFromServer.find(user => user.id === userId);

  return foundedUser || null;
};

const productsWithCategories = productsFromServer.map(
  product => ({
    ...product,
    category: getCategoryById(product.categoryId),
  }),
);

const productsWithCategoriesAndUsers: Product[] = productsWithCategories.map(
  product => ({
    ...product,
    user: getUserById(product.category?.ownerId),
  }),
);

export const App: React.FC = () => {
  const [products, setProducts]
    = useState<Product[]>(productsWithCategoriesAndUsers);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [query, setQuery] = useState('');
  const queriedProducts = products.filter(product => {
    const productName = product.name.toLowerCase();
    const searchInput = query.toLowerCase();

    return productName.includes(searchInput);
  });

  const clearQuery = () => {
    setQuery('');
  };

  const filterByOwner = (userId: number) => {
    if (userId === 0) {
      setSelectedUserId(userId);
      setProducts(productsWithCategoriesAndUsers);
    } else {
      setSelectedUserId(userId);
      setProducts(productsWithCategoriesAndUsers.filter(product => (
        product.user?.id === userId
      )));
    }
  };

  const handleSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => (
    setQuery(event.target.value)
  );

  const handleFiltersReset = () => {
    setProducts(productsWithCategoriesAndUsers);
    setSelectedUserId(0);
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
                onClick={() => filterByOwner(0)}
                className={classNames(
                  { 'is-active': selectedUserId === 0 },
                )}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => filterByOwner(user.id)}
                  className={classNames(
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
                  onChange={handleSearchQuery}
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
                      onClick={clearQuery}
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
                onClick={handleFiltersReset}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {queriedProducts.length === 0
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )
            : (
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
                  {queriedProducts.map(product => {
                    const {
                      id,
                      name,
                      category,
                      user,
                    } = product;

                    return (
                      <tr data-cy="Product">
                        <td
                          className="has-text-weight-bold"
                          data-cy="ProductId"
                        >
                          {id}
                        </td>

                        <td data-cy="ProductName">{name}</td>
                        <td data-cy="ProductCategory">
                          {`${category?.icon} - ${category?.title}`}
                        </td>

                        <td
                          data-cy="ProductUser"
                          className={classNames(
                            user?.sex === 'm'
                              ? 'has-text-link'
                              : 'has-text-danger',
                          )}
                        >
                          {user?.name}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
        </div>
      </div>
    </div>
  );
};
