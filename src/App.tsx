import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

interface User {
  id: number;
  name: string;
  sex: string;
}

interface Category {
  id: number;
  title: string;
  icon: string;
  ownerId: number,
}

interface Product {
  id: number;
  name: string;
  categoryId: number;
}

interface FullProduct extends Product {
  category: Category | null;
  user: User | null;
}

const GetCategory = (id: number) => {
  return categoriesFromServer.find(category => category.id === id) || null;
};

const GetUser = (id: number) => {
  const category = GetCategory(id);

  return usersFromServer.find(user => user.id === category?.ownerId) || null;
};

const GetFullProductsList = () => (
  productsFromServer.map(product => ({
    ...product,
    category: GetCategory(product.categoryId),
    user: GetUser(product.categoryId),
  }))
);

export const App: React.FC = () => {
  const [selectedUser, setselectedUser] = useState(0);
  const [query, setQuery] = useState('');

  const meetsTheRequest = (value: string) => {
    return value.toLowerCase().includes(query.toLowerCase());
  };

  const products: FullProduct[] = GetFullProductsList()
    .filter(product => (
      selectedUser
        ? product.user?.id === selectedUser && meetsTheRequest(product.name)
        : meetsTheRequest(product.name)
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
                onClick={() => setselectedUser(0)}
                className={classNames(
                  { 'is-active': selectedUser === 0 },
                )}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  onClick={() => setselectedUser(user.id)}
                  className={classNames(
                    { 'is-active': selectedUser === user.id },
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
                  onChange={(event) => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {query && (
                    // eslint-disable-next-line jsx-a11y/control-has-associated-label
                    <button
                      onClick={() => setQuery('')}
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
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
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
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
                  setselectedUser(0);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {products.length > 0
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
                  {products.map(product => (
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
                        className={classNames(
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
