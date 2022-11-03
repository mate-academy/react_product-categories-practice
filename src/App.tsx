import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

interface Category {
  id: number,
  title: string,
  icon: string,
  ownerId: number,
}

interface Product {
  id: number,
  name: string,
  categoryId: number,
}

interface User {
  id: number,
  name: string,
  sex: string,
}

interface CategoryWithUser extends Category{
  user: User | null,
}

interface ProductWithCategory extends Product {
  category: CategoryWithUser | null,
}

const getUserById = (userId: number) => {
  const foundUser = usersFromServer.find(user => user.id === userId);

  return foundUser || null;
};

const categoryWithUser: CategoryWithUser[] = categoriesFromServer
  .map(category => ({
    ...category,
    user: getUserById(category.ownerId),
  }));

const getCategoryById = (categoryId: number) => {
  const foundCategory = categoryWithUser
    .find(category => category.id === categoryId);

  return foundCategory || null;
};

const productWithCategory: ProductWithCategory[] = productsFromServer
  .map(product => ({
    ...product,
    category: getCategoryById(product.categoryId),
  }));

export function getVisibleProducts(userId: number, query: string) {
  let visibleProducts = productWithCategory;

  if (userId > 0) {
    visibleProducts = visibleProducts
      .filter(product => product.category?.ownerId === userId);
  }

  if (query.length) {
    visibleProducts = visibleProducts
      .filter(
        product => product.name.toLowerCase().includes(query.toLowerCase()),
      );
  }

  return visibleProducts;
}

export const App: React.FC = () => {
  const [userId, setUserId] = useState(0);
  const [query, setQuery] = useState('');

  const visibleProducts = getVisibleProducts(userId, query);

  const handleResetAllFilters = () => {
    setUserId(0);
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
                className={classNames({ 'is-active': userId === 0 })}
                onClick={() => setUserId(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({ 'is-active': userId === user.id })}
                  onClick={() => setUserId(user.id)}
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
                onClick={handleResetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!visibleProducts.length
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
                  {visibleProducts.map(product => (
                    <tr key={product.id} data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="ProductCategory">{`${product.category?.icon} - ${product.category?.title}`}</td>

                      <td
                        data-cy="ProductUser"
                        className={classNames(
                          {
                            'has-text-link':
                            product.category?.user?.sex === 'm',
                          },
                          {
                            'has-text-danger':
                              product.category?.user?.sex === 'f',
                          },
                        )}

                      >
                        {product.category?.user?.name}
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
