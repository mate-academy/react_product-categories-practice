import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import { CategoriesList } from './components/CategoriesList';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

import { Category } from './types/Category';
import { Product } from './types/Product';
import { User } from './types/User';
import { FullProduct } from './types/FullProduct';

const prepareProducts = (
  products: Product[],
  users: User[],
  categories: Category[],
): FullProduct[] => {
  return products.map(product => {
    const foundCategory = categories
      .find(category => category.id === product.categoryId);

    return {
      ...product,
      category: foundCategory,
      user: users.find(
        user => user.id === foundCategory?.ownerId,
      ),
    };
  });
};

const preparedProducts = prepareProducts(
  productsFromServer,
  usersFromServer,
  categoriesFromServer,
);

export const App: React.FC = () => {
  const [products] = useState<FullProduct[]>(preparedProducts);
  const [selectUser, setSelectUser] = useState('all');
  const [query, setQuery] = useState('');
  const [selectCategories, setSelectCategories]
    = useState<number[]>([]);

  const onSelectUser = (selectedUser: string) => {
    setSelectUser(selectedUser);
  };

  const onChangeQuery = (text: string) => {
    setQuery(text);
  };

  const onSelectCategories = (categoryId: number) => {
    setSelectCategories(currentCategories => {
      return [...currentCategories, categoryId];
    });
  };

  const resetCategories = () => {
    setSelectCategories([]);
  };

  const handleReset = () => {
    setSelectUser('all');
    setQuery('');
  };

  const visibleProducts = (selectedUser: string) => {
    const productsByUser = products.filter(product => {
      switch (selectedUser) {
        case 'Roma':
          return product.user?.name === 'Roma';
        case 'Anna':
          return product.user?.name === 'Anna';
        case 'Max':
          return product.user?.name === 'Max';
        case 'John':
          return product.user?.name === 'John';
        default:
          return product;
      }
    });

    return productsByUser.filter(product => (
      product.name.toLowerCase().includes(query.toLowerCase())
    ));
  };

  const shownProducts = visibleProducts(selectUser);

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
                onClick={() => onSelectUser('all')}
                className={cn({
                  'is-active': selectUser === 'all',
                })}
              >
                All
              </a>

              {
                usersFromServer.map(user => (
                  <a
                    key={user.id}
                    data-cy="FilterUser"
                    href="#/"
                    onClick={() => onSelectUser(user.name)}
                    className={cn({
                      'is-active': selectUser === user.name,
                    })}
                  >
                    {user.name}
                  </a>
                ))
              }
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => onChangeQuery(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {
                  query && (
                    <span className="icon is-right">
                      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                      <button
                        data-cy="ClearButton"
                        type="button"
                        className="delete"
                        onClick={() => onChangeQuery('')}
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
                className={cn('mr-6 is-outlined button ', {
                  'is-success': selectCategories.length === 0,
                })}
                onClick={resetCategories}
              >
                All
              </a>

              {
                categoriesFromServer.map(category => (
                  <a
                    key={category.id}
                    data-cy="Category"
                    className={cn('button mr-2 my-1', {
                      'is-info': selectCategories.includes(category.id),
                    })}
                    href="#/"
                    onClick={() => onSelectCategories(category.id)}
                  >
                    {category.title}
                  </a>
                ))
              }
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleReset}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {
            shownProducts.length > 0
              ? <CategoriesList products={shownProducts} />
              : (
                <p data-cy="NoMatchingMessage">
                  No products matching selected criteria
                </p>
              )
          }
        </div>
      </div>
    </div>
  );
};
