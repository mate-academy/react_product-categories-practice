import React, { useEffect, useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

interface User {
  id: number,
  name: string,
  sex: string,
}

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

interface ExtendedProduct extends Product {
  user?: User,
  category?: Category,
}

const extendProduct = (
  users: User[],
  categories: Category[],
  products: Product[],
): ExtendedProduct[] => {
  return products.map(product => {
    const categoryFromProduct = product.categoryId;
    const userFromCategory = categories
      .find(category => category.id === categoryFromProduct);
    const userFromCategoryId = userFromCategory?.ownerId;
    const userById = users.find(user => user.id === userFromCategoryId);

    return ({
      ...product,
      category: categories.find(category => category.id === product.categoryId),
      user: userById,
    });
  });
};

const extendedProducts = extendProduct(
  usersFromServer,
  categoriesFromServer,
  productsFromServer,
);

export const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  // eslint-disable-next-line max-len
  const [visibleProducts, setVisibleProducts] = useState<ExtendedProduct[]>(extendedProducts);
  const [query, setQuery] = useState('');

  const showAllProducts = () => {
    setVisibleProducts(extendedProducts);
  };

  const filterProductsByUser = (user?: User) => {
    const productsForShow = extendedProducts
      .filter(product => product.category?.ownerId === user?.id);

    setVisibleProducts(productsForShow);
  };

  const filterProductsByQuery = (input: string) => {
    const productsForShow = visibleProducts
      // eslint-disable-next-line max-len
      .filter(product => product.name.toLowerCase().includes(input.toLowerCase()));

    setVisibleProducts(productsForShow);
  };

  const resetSearch = () => {
    const productsForShow = visibleProducts;

    setVisibleProducts(productsForShow);
  };

  useEffect(() => {
    filterProductsByUser(selectedUser);
    filterProductsByQuery(query);
    resetSearch();
  }, [query, selectedUser]);

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
                className={classNames({
                  'is-active': selectedUser === null,
                })}
                onClick={() => {
                  setSelectedUser(null);
                  showAllProducts();
                }}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  className={classNames({
                    'is-active': user.id === selectedUser,
                  })}
                  onClick={() => {
                    setSelectedUser(user.id);
                    filterProductsByUser(user);
                  }}
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
                  onChange={event => {
                    setQuery(event.target.value);
                    filterProductsByQuery(event.target.value);
                  }}
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
                      onClick={() => {
                        setQuery('');
                        resetSearch();
                      }}
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
              {
                visibleProducts.map(product => (
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
                      className={classNames({
                        'has-text-link': product.user?.sex === 'm',
                        'has-text-danger': product.user?.sex === 'f',
                      })}
                    >
                      {product.user?.name}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
