import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(c => c.id === product.categoryId);
  const user = usersFromServer.find(u => u.id === category?.ownerId);

  return { ...product, category, user };
});

export const App = () => {
  const [userId, setUserId] = useState(0);
  const [query, setQuery] = useState('');
  const [categoryIds, setCategoryIds] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [isReversed, setIsReversed] = useState(false);

  const handleInput = (event) => {
    const { value } = event.target;

    setQuery(value);
  };

  const resetFilters = () => {
    setUserId(0);
    setQuery('');
    setCategoryIds([]);
  };

  const addCategory = (categoryId) => {
    setCategoryIds(currentCategoryIds => (
      [...currentCategoryIds, categoryId]
    ));
  };

  const removeCategory = (categoryId) => {
    setCategoryIds(currentCategoryIds => (
      currentCategoryIds.filter(c => c !== categoryId)
    ));
  };

  const handleSort = (field) => {
    if (sortBy !== field) {
      setSortBy(field);
    } else if (!isReversed) {
      setIsReversed(true);
    } else {
      setSortBy('');
      setIsReversed(false);
    }
  };

  let visibleProducts = [...products];

  if (userId) {
    visibleProducts = visibleProducts.filter(
      p => p.user.id === userId,
    );
  }

  if (query) {
    const lowerQuery = query.toLowerCase();

    visibleProducts = visibleProducts.filter(
      p => p.name.toLowerCase().includes(lowerQuery),
    );
  }

  if (categoryIds.length !== 0) {
    visibleProducts = visibleProducts.filter(
      p => categoryIds.includes(p.categoryId),
    );
  }

  if (sortBy) {
    visibleProducts.sort((p1, p2) => {
      switch (sortBy) {
        case 'id':
          return p2.id - p1.id;
        case 'product':
          return p2.name.localeCompare(p1.name);
        case 'category':
          return p2.category.title.localeCompare(p1.category.title);
        case 'user':
          return p2.user.name.localeCompare(p1.user.name);
        default:
          return 0;
      }
    });
  }

  if (isReversed) {
    visibleProducts.reverse();
  }

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
                onClick={() => setUserId(0)}
                className={cn({
                  'is-active': userId === 0,
                })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setUserId(user.id)}
                  className={cn({
                    'is-active': user.id === userId,
                  })}
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
                className={cn('button is-success mr-6', {
                  'is-outlined': categoryIds.length !== 0,
                })}
                onClick={() => setCategoryIds([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                categoryIds.includes(category.id)
                  ? (
                    <a
                      key={category.id}
                      data-cy="Category"
                      className="button mr-2 my-1 is-info"
                      href="#/"
                      onClick={() => removeCategory(category.id)}
                    >
                      {category.title}
                    </a>
                  )
                  : (
                    <a
                      key={category.id}
                      data-cy="Category"
                      className="button mr-2 my-1"
                      href="#/"
                      onClick={() => addCategory(category.id)}
                    >
                      {category.title}
                    </a>
                  )

              ))}
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
          {visibleProducts.length === 0
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

                        <a
                          href="#/"
                          onClick={() => handleSort('id')}
                        >
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={cn('fas', {
                                'fa-sort': sortBy !== 'id',
                                'fa-sort-up': (
                                  sortBy === 'id' && isReversed
                                ),
                                'fa-sort-down': (
                                  sortBy === 'id' && !isReversed
                                ),
                              })}
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Product

                        <a
                          href="#/"
                          onClick={() => handleSort('product')}
                        >
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={cn('fas', {
                                'fa-sort': sortBy !== 'product',
                                'fa-sort-up': (
                                  sortBy === 'product' && isReversed
                                ),
                                'fa-sort-down': (
                                  sortBy === 'product' && !isReversed
                                ),
                              })}
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Category

                        <a
                          href="#/"
                          onClick={() => handleSort('category')}
                        >
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={cn('fas', {
                                'fa-sort': sortBy !== 'category',
                                'fa-sort-up': (
                                  sortBy === 'category' && isReversed
                                ),
                                'fa-sort-down': (
                                  sortBy === 'category' && !isReversed
                                ),
                              })}
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User

                        <a
                          href="#/"
                          onClick={() => handleSort('user')}
                        >
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={cn('fas', {
                                'fa-sort': sortBy !== 'user',
                                'fa-sort-up': (
                                  sortBy === 'user' && isReversed
                                ),
                                'fa-sort-down': (
                                  sortBy === 'user' && !isReversed
                                ),
                              })}
                            />
                          </span>
                        </a>
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleProducts.map(product => (
                    <tr data-cy="Product" key={product.id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="ProductCategory">
                        {`${product.category.icon} - ${product.category.title}`}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={cn({
                          'has-text-link': product.user.sex === 'm',
                          'has-text-danger': product.user.sex === 'f',
                        })}
                      >
                        {product.user.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      </div>
    </div>
  );
};
