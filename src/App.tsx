import React, { useEffect, useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';
import { Category } from './types/category';
import { Product } from './types/product';

const categoriesWithUsers = (): Category[] => {
  return categoriesFromServer.map(category => {
    return {
      ...category,
      user: usersFromServer.find(user => user.id === category.ownerId) || null,
    };
  });
};

const productsWithCategories = (): Product[] => {
  return productsFromServer.map(product => {
    return {
      ...product,
      category: categoriesWithUsers()
        .find(category => category.id === product.categoryId) || null,
    };
  });
};

export const App: React.FC = () => {
  const allProducts = productsWithCategories();

  const [visibleProducts, setVisibleProducts] = useState(allProducts);
  const [selectedUser, setSelectedUser] = useState(0);
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const filterProducts = () => {
    let filteredProducts = allProducts;

    if (selectedUser) {
      filteredProducts = filteredProducts.filter(product => (
        product.category?.user?.id === selectedUser
      ));
    }

    if (query) {
      filteredProducts = filteredProducts.filter(product => {
        const lowerQuery = query.toLowerCase();
        const lowerName = product.name.toLowerCase();

        return lowerName.includes(lowerQuery);
      });
    }

    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter(product => (
        selectedCategories.includes(product.categoryId)
      ));
    }

    return filteredProducts;
  };

  useEffect(() => {
    setVisibleProducts(filterProducts());
  }, [selectedUser, selectedCategories, query]);

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
                className={cn({ 'is-active': selectedUser === 0 })}
                onClick={() => setSelectedUser(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={cn({ 'is-active': selectedUser === user.id })}
                  onClick={() => setSelectedUser(user.id)}
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
                  onChange={event => setQuery(event.target.value)}
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
                onClick={() => setSelectedCategories([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => {
                return !selectedCategories.includes(category.id)
                  ? (
                    <a
                      key={category.id}
                      data-cy="Category"
                      className="button mr-2 my-1"
                      href="#/"
                      onClick={() => setSelectedCategories(prevState => (
                        [
                          ...prevState,
                          category.id,
                        ]
                      ))}
                    >
                      {category.title}
                    </a>
                  )
                  : (
                    <a
                      key={category.id}
                      data-cy="Category"
                      className="button mr-2 my-1 is-info"
                      href="#/"
                      onClick={() => setSelectedCategories(prevState => {
                        prevState.splice(selectedCategories
                          .indexOf(category.id), 1);

                        return [...prevState];
                      })}
                    >
                      {category.title}
                    </a>
                  );
              })}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setSelectedUser(0);
                  setSelectedCategories([]);
                  setQuery('');
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {(visibleProducts.length === 0)
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
                  {visibleProducts.map(product => {
                    const { id, name, category } = product;

                    return (
                      <tr data-cy="Product">
                        <td
                          className="has-text-weight-bold"
                          data-cy="ProductId"
                        >
                          {id}
                        </td>

                        <td data-cy="ProductName">
                          {name}
                        </td>
                        <td data-cy="ProductCategory">
                          {`${category?.icon} - ${category?.title}`}
                        </td>

                        <td
                          data-cy="ProductUser"
                          className={cn({
                            'has-text-link': category?.user?.sex === 'm',
                          },
                          {
                            'has-text-danger': category?.user?.sex === 'f',
                          })}
                        >
                          {category?.user?.name}
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
