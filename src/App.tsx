import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

type User = {
  id: number;
  name: string;
  sex: string;
};

type Product = {
  id: number;
  name: string;
  categoryId: number;
};

type Category = {
  id: number;
  title: string;
  icon: string;
  ownerId: number,
};

interface FinalProduct extends Product {
  category: Category | null;
  user: User | null;
}

const getId = (id: number) => {
  return categoriesFromServer.find(category => category.id === id) || null;
};

const getUser = (id: number) => {
  const category = getId(id);

  return usersFromServer.find(user => (
    category !== null ? user.id === category.ownerId : false))
    || null;
};

const getFinalProducts = () => (
  productsFromServer.map(product => ({
    ...product,
    category: getId(product.categoryId),
    user: getUser(product.categoryId),
  }))
);

export const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(0);
  const [query, setQuery] = useState('');
  // const [productList, setProductList] = useState<FinalProduct[]>();

  const searchByQuery = (value: string) => {
    return value.toLowerCase().includes(query.toLowerCase());
  };

  const products: FinalProduct[] = getFinalProducts()
    .filter(product => (
      selectedUser
        ? product.user?.id === selectedUser && searchByQuery(product.name)
        : searchByQuery(product.name)
    ));

  // const handleFilterByCategory = (category: string) => {
  //   const filteredByCategory = productList.filter(product => (
  //     product.category !== null ? product.category.title === category : false
  //   ));

  //   setProductList(filteredByCategory);
  // };

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
                onClick={() => setSelectedUser(0)}
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
                  onClick={() => setSelectedUser(user.id)}
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
                className="button is-success mr-6 is-info"
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className="button mr-2 my-1"
                  href="#/"
                  // onClick={() => handleFilterByCategory(category.title)}
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
                  setSelectedUser(0);
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
