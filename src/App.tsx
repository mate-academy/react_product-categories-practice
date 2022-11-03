import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import { Product } from './types/Product';
import { ComplexProduct } from './types/ComplexProduct';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

function getUser(product: Product) {
  const foundCategory = categoriesFromServer
    .find(category => category.id === product.categoryId);
  const foundUser = usersFromServer
    .find(user => user.id === foundCategory?.ownerId);

  return foundUser;
}

const complexProducts: ComplexProduct[] = productsFromServer.map(product => ({
  ...product,
  category: categoriesFromServer.find(categ => categ.id === product.categoryId),
  user: getUser(product),
}));

export const App: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [isSelected, setIsSelected] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);

  const selectUserId = (id: number) => {
    setSelectedUserId(id);
    setIsSelected(true);
  };

  const resetSelectedUser = () => {
    setIsSelected(false);
    setSelectedUserId(0);
  };

  const visibleProducts = complexProducts.filter(product => (
    product.user?.id === selectedUserId
  ));

  let products = complexProducts;

  if (isSelected) {
    products = visibleProducts;
  }

  if (query.length > 0) {
    products = products
      .filter(product => product.name.toLowerCase()
        .includes(query.toLowerCase()));
  }

  const resetFiltering = () => {
    setQuery('');
  };

  const selectCategory = (id: number) => {
    setSelectedCategoryId(id);
  };

  const resetAllFilters = () => {
    setQuery('');
    setSelectedCategoryId(0);
    setIsSelected(false);
    setSelectedUserId(0);
  };

  if (selectedCategoryId !== 0) {
    products = products
      .filter(product => product.categoryId === selectedCategoryId);
  }

  const resetFilteringByCategory = () => {
    setSelectedCategoryId(0);
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
                onClick={resetSelectedUser}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  onClick={() => selectUserId(user.id)}
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
                  onChange={(event) => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {(query.length > 0)
                && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={resetFiltering}
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
                onClick={resetFilteringByCategory}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={classNames('button mr-2 my-1',
                    { 'is-info': selectedCategoryId === category.id })}
                  href="#/"
                  key={category.id}
                  onClick={() => selectCategory(category.id)}
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
                onClick={resetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {(query.length > 0 && products.length === 0)
          && (
            <p>No results</p>
          )}

          {(isSelected && visibleProducts.length === 0)
          && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {(products.length > 0)
            && (
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
                  {products.map(complexProduct => (
                    <tr data-cy="Product" key={complexProduct.id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {complexProduct.id}
                      </td>

                      <td data-cy="ProductName">
                        {complexProduct.name}
                      </td>
                      <td data-cy="ProductCategory">
                        {`${complexProduct.category?.icon} - ${complexProduct.category?.title}`}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={classNames(
                          'has-text-link',
                          {
                            'has-text-danger': complexProduct.user?.sex === 'f',
                          },
                        )}
                      >
                        {complexProduct.user?.name}
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
