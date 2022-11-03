import React, { useState } from 'react';
import './App.scss';

import cn from 'classnames';
import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';
import { Category } from './types/Category';
import { User } from './types/User';
import { Product } from './types/Product';

export const App: React.FC = () => {
  const [users] = useState<User[]>(usersFromServer);
  const [products] = useState<Product[]>(productsFromServer);
  const [categories] = useState<Category[]>(categoriesFromServer);
  const [query, setQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const handleClick = (userId: number) => {
    setSelectedUserId(userId);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const resetAllFilters = () => {
    setQuery('');
    setSelectedUserId(0);
    setSelectedCategories([]);
  };

  const selectCategory = (categoryId: number) => {
    setSelectedCategories((currentSelectedCategories) => {
      if (categoryId === 0) {
        return [];
      }

      if (selectedCategories.includes(categoryId)) {
        return currentSelectedCategories.filter(id => id !== categoryId);
      }

      return [...currentSelectedCategories, categoryId];
    });
  };

  const filteredProducts = products
    .filter(product => {
      const { categoryId } = product;
      const productCategory = categories?.find(
        categorie => categorie.id === categoryId,
      );
      const productOwner = users.find(
        user => user.id === productCategory?.ownerId,
      );

      if (selectedUserId === 0) {
        return product;
      }

      return selectedUserId === productOwner?.id;
    })
    .filter(product => {
      const lowerName = product.name.toLowerCase();
      const lowerQuery = query.toLowerCase();

      return lowerName.includes(lowerQuery);
    })
    .filter(product => {
      const { categoryId } = product;

      if (!selectedCategories.length) {
        return product;
      }

      return selectedCategories.includes(categoryId);
    });

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
                className={cn({ 'is-active': selectedUserId === 0 })}
                onClick={() => {
                  handleClick(0);
                }}
              >
                All
              </a>

              {users.map(user => {
                const { id } = user;

                return (
                  <a
                    data-cy="FilterUser"
                    href="#/"
                    onClick={() => {
                      handleClick(id);
                    }}
                    className={cn({ 'is-active': selectedUserId === id })}
                    key={id}
                  >
                    {user.name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={onChange}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {query && (
                    // eslint-disable-next-line jsx-a11y/control-has-associated-label
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => {
                        setQuery('');
                      }}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button', {
                  'is-success mr-6': !selectedCategories.length,
                  'is-success mr-6 is-outlined': selectedCategories.length,
                })}
                onClick={() => {
                  selectCategory(0);
                }}
              >
                All
              </a>

              {categories?.map(category => (
                <a
                  data-cy="Category"
                  // className="button mr-2 my-1" // 'is-info' - means selected
                  className={cn('button mr-2 my-1',
                    {
                      'is-info': selectedCategories.includes(category.id),
                    })}
                  href="#/"
                  key={category.id}
                  onClick={() => {
                    selectCategory(category.id);
                  }}
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
          {!filteredProducts.length
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
                  {filteredProducts.map(product => {
                    const { id, name, categoryId } = product;
                    const productCategory = categories?.find(
                      categorie => categorie.id === categoryId,
                    );
                    const productOwner = users.find(
                      user => user.id === productCategory?.ownerId,
                    );

                    return (
                      <tr data-cy="Product" key={id}>
                        <td
                          className="has-text-weight-bold"
                          data-cy="ProductId"
                        >
                          {id}
                        </td>

                        <td data-cy="ProductName">{name}</td>
                        <td data-cy="ProductCategory">
                          {`${productCategory?.icon} - ${productCategory?.title}`}
                        </td>

                        <td
                          data-cy="ProductUser"
                          className={cn({
                            'has-text-link': productOwner?.sex === 'm',
                            'has-text-danger': productOwner?.sex === 'f',
                          })}
                        >
                          {productOwner?.name}
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
