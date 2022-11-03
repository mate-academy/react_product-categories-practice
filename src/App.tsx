import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';
import { ProductTable } from './components/ProductTable';

function getOwner(ownerId: number | undefined) {
  const foundOwner = usersFromServer.find(user => user.id === ownerId);

  return foundOwner || null;
}

function getCategory(categoryId: number) {
  const foundCategory = categoriesFromServer.find(
    category => category.id === categoryId,
  );

  return {
    ...foundCategory,
    owner: foundCategory ? getOwner(foundCategory?.ownerId) : null,
  };
}

const preparedProducts = productsFromServer.map(product => ({
  ...product,
  category: getCategory(product.categoryId),
}));

export const App: React.FC = () => {
  const [productsList, setProductsList] = useState(preparedProducts);
  const [userSelectedId, setUserSelectedId] = useState(0);
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    setProductsList(prevList => {
      return prevList.filter(
        product => (product.name.toLowerCase().includes(query.toLowerCase())),
      );
    });
  };

  const handleClick = (ownerId: number) => {
    setProductsList(preparedProducts.filter(
      product => product.category.owner?.id === ownerId,
    ));
    setUserSelectedId(ownerId);
  };

  const userChosen = usersFromServer.find(
    user => user.id === userSelectedId,
  );

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
                onClick={() => {
                  setProductsList(preparedProducts);
                  setUserSelectedId(0);
                }}
                className={userSelectedId === 0 ? 'is-active' : ''}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  onClick={() => handleClick(user.id)}
                  className={user.id === userChosen?.id ? 'is-active' : ''}
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
                  onChange={(event) => {
                    setQuery(event.target.value);
                    handleSearch();
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {query !== '' && (
                    <>
                      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                      <button
                        data-cy="ClearButton"
                        type="button"
                        className="delete"
                        onClick={() => setQuery('')}
                      />
                    </>
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

              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <ProductTable products={productsList} />
      </div>
    </div>
  );
};
