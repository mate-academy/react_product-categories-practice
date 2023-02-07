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
  const [reversed, setReversed] = useState(false);

  const resetAllFilters = () => {
    setQuery('');
    setUserId(0);
    setCategoryIds([]);
  };

  const handleTableSort = (field) => {
    if (sortBy !== field) {
      setSortBy(field);
      setReversed(false);
    } else if (!reversed) {
      setReversed(true);
    } else {
      setSortBy('');
      setReversed(false);
    }
  };

  let visibleProducts = [...products];

  if (userId) {
    visibleProducts = visibleProducts.filter(
      p => p.user?.id === userId,
    );
  }

  if (query) {
    const lowerQuery = query.toLowerCase();

    visibleProducts = visibleProducts.filter(
      p => p.name.toLowerCase().includes(lowerQuery),
    );
  }

  if (categoryIds.length > 0) {
    visibleProducts = visibleProducts.filter(
      p => categoryIds.includes(p.categoryId),
    );
  }

  if (sortBy) {
    visibleProducts.sort((p1, p2) => {
      switch (sortBy) {
        case 'id':
          return p1.id - p2.id;

        case 'product':
          return p1.name.localeCompare(p2.name);

        case 'category': {
          const c1Name = p1.category?.title || '';
          const c2Name = p2.category?.title || '';

          return c1Name.localeCompare(c2Name);
        }

        case 'user': {
          const u1Name = p1.user?.name || '';
          const u2Name = p2.user?.name || '';

          return u1Name.localeCompare(u2Name);
        }

        default:
          return 0;
      }
    });
  }

  if (reversed) {
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
                className={cn({ 'is-active': userId === 0 })}
                onClick={() => setUserId(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  key={user.id}
                  href="#/"
                  onClick={() => setUserId(user.id)}
                  className={cn({ 'is-active': user.id === userId })}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="search"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
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
                data-cy="AllCategories"
                href="#/"
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
                      data-cy="Category"
                      key={category.id}
                      className="button mr-2 my-1 is-info"
                      href="#/"
                      onClick={() => {
                        setCategoryIds(currentCategoryIds => (
                          currentCategoryIds.filter(id => id !== category.id)
                        ));
                      }}
                    >
                      {category.title}
                    </a>
                  ) : (
                    <a
                      data-cy="Category"
                      key={category.id}
                      className="button mr-2 my-1"
                      href="#/"
                      onClick={() => {
                        setCategoryIds(currentCategoryIds => (
                          [...currentCategoryIds, category.id]
                        ));
                      }}
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
                onClick={resetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0
            ? (
              <p>No results</p>
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
                          onClick={() => handleTableSort('id')}
                        >
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={cn('fas', {
                                'fa-sort': sortBy !== 'id',
                                'fa-sort-up': sortBy === 'id' && !reversed,
                                'fa-sort-down': sortBy === 'id' && reversed,
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
                          onClick={() => handleTableSort('product')}
                        >
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={cn('fas', {
                                'fa-sort': sortBy !== 'product',
                                'fa-sort-up': sortBy === 'product' && !reversed,
                                'fa-sort-down': sortBy === 'product'
                                  && reversed,
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
                          onClick={() => handleTableSort('category')}
                        >
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={cn('fas', {
                                'fa-sort': sortBy !== 'category',
                                'fa-sort-up': sortBy === 'category'
                                  && !reversed,
                                'fa-sort-down': sortBy === 'category'
                                  && reversed,
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
                          onClick={() => handleTableSort('user')}
                        >
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={cn('fas', {
                                'fa-sort': sortBy !== 'user',
                                'fa-sort-up': sortBy === 'user'
                                  && !reversed,
                                'fa-sort-down': sortBy === 'user'
                                  && reversed,
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
                    <tr data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                      <td
                        data-cy="ProductUser"
                        className="has-text-link"
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
