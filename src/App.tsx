import React, { useEffect, useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';
import { FullInfo } from './types/FullInfo';

export const App: React.FC = () => {
  const [products, setProducts] = useState<FullInfo[]>([]);
  const [selectedUser, setSelectedUser] = useState('all');
  const [visibleProducts, setVisibleProducts] = useState<FullInfo[]>(products);
  const [serchField, setSerchField] = useState('');

  useEffect(() => {
    const getInfo = () => {
      const fullInfo = productsFromServer.map(product => {
        const category = categoriesFromServer
          .find(currentCategory => currentCategory.id === product.categoryId)
          || null;

        const user = usersFromServer
          .find(currentUser => currentUser.id === category?.ownerId) || null;

        return {
          ...product,
          category,
          user,
        };
      });

      setProducts(fullInfo);
    };

    getInfo();
  }, []);

  const getUser = (userName: string) => {
    setSelectedUser(userName);
  };

  const clearSearchField = () => {
    setSerchField('');
  };

  const resetFilters = () => {
    setSerchField('');
    setSelectedUser('all');
  };

  useEffect(() => {
    switch (selectedUser) {
      case 'all':
        setVisibleProducts(products
          .filter(product => product.name
            .toLowerCase()
            .includes(serchField.toLowerCase())));
        break;

      case selectedUser:
        setVisibleProducts(visibleProducts
          .filter(product => product.user?.name === selectedUser));
        break;

      default:
        break;
    }
  }, [products, selectedUser, serchField, visibleProducts]);

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
                className={classNames({ 'is-active': selectedUser === 'all' })}
                href="#/"
                onClick={() => setSelectedUser('all')}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames(
                    { 'is-active': selectedUser === user.name },
                  )}
                  key={user.id}
                  onClick={() => getUser(user.name)}
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
                  value={serchField}
                  onChange={(event) => setSerchField(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {serchField

                // eslint-disable-next-line max-len
                && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => clearSearchField()}
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

              {categoriesFromServer.map(category => (
                <a
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
                onClick={() => resetFilters()}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

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
              {visibleProducts.map(product => {
                const {
                  id,
                  name,
                  category,
                  user,
                } = product;

                return (
                  <tr data-cy="Product" key={id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {id}
                    </td>

                    <td data-cy="ProductName">{name}</td>
                    <td data-cy="ProductCategory">
                      {`${category?.icon} - ${category?.title}`}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={user?.sex === 'm'
                        ? 'has-text-link'
                        : 'has-text-danger'}
                    >
                      {user?.name}
                    </td>
                  </tr>
                );
              })}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
