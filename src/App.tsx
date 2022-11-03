import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';
import { Category } from './types/category';
import { User } from './types/user';
import { Product } from './types/product';
import { FullProduct } from './types/fullIProduct';

const getCategory = (categoryId: number): Category | null => {
  return categoriesFromServer.find(({ id }) => id === categoryId) || null;
};

const getUser = (ownerId: number): User | null => {
  return usersFromServer.find(({ id }) => id === ownerId) || null;
};

const getFullInfoProduct = (products: Product[]): FullProduct[] => {
  return products.map(product => {
    const category = getCategory(product.categoryId);
    let user = null;

    if (category) {
      user = getUser(category.ownerId);
    }

    return {
      ...product,
      category,
      user,
    };
  });
};

// enum CategoryType {
//   All = 'all',
//   Grocery = 'Grocery',
//   Drinks = 'Drinks',
//   Fruits = 'Fruits',
//   Electronics = 'Electronics',
//   Clothes = 'Clothes',
// }

export const App: React.FC = () => {
  const products = getFullInfoProduct(productsFromServer);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [usersProducts, setUsersProducts] = useState<FullProduct[]>(products);
  // eslint-disable-next-line max-len
  // const [categoryProducts, setCategoryProducts] = useState<FullProduct[]>(usersProducts);
  const [query, setQuery] = useState('');
  // eslint-disable-next-line max-len
  // const [selectedCategory, setSelectedCategory] = useState<CategoryType>(CategoryType.All);

  const handleSelectUser = (user: User) => {
    if (user.id !== selectedUser?.id) {
      setSelectedUser(user);
      setUsersProducts(
        products.filter(product => product.user === user),
      );
    }
  };

  // const handleSelectedCategory = (category: Category) => {
  //   if (category.title !== selectedCategory) {
  //     setSelectedCategory(category.title as CategoryType);
  //     setCategoryProducts(
  //       usersProducts.filter(product => product.category === category),
  //     );
  //   }
  // };

  const resetSelectedUser = () => {
    setSelectedUser(null);
    setUsersProducts(products);
  };

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const resetQuery = () => {
    setQuery('');
  };

  const resetAll = () => {
    setQuery('');
    setUsersProducts(products);
  };

  const filteredProducts = usersProducts.filter(({ name }) => (
    name.toLowerCase().includes(query.toLowerCase())
  ));

  const hasResults = filteredProducts.length > 0;

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
                className={classNames(
                  { 'is-active': selectedUser === null },
                )}
                onClick={resetSelectedUser}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames(
                    { 'is-active': user.id === selectedUser?.id },
                  )}
                  onClick={() => handleSelectUser(user)}
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
                  onChange={(event) => handleQuery(event)}
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
                      onClick={resetQuery}
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
                onClick={resetAll}

              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {hasResults
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
                            {/* eslint-disable-next-line max-len */}
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
                  {filteredProducts.map(product => (
                    <tr data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="ProductCategory">{`${product.category?.icon} - ${product.category?.title}`}</td>

                      <td
                        data-cy="ProductUser"
                        className={classNames(
                          { 'has-text-link': product.user?.sex === 'm' },
                          { 'has-text-danger': product.user?.sex === 'f' },
                        )}
                      >
                        {product.user?.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )}
        </div>
      </div>
    </div>
  );
};
