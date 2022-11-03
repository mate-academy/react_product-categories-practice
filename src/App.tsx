import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

interface Product {
  id: number,
  name: string,
  categoryId: number,
}

type User = {
  id: number,
  name: string,
  sex: string,
};

type Category = {
  id: number,
  title: string,
  icon: string,
  ownerId: number,
};

interface ProductAndCategory extends Product {
  category?: Category,
}

interface ProductWithUserAndCategory extends ProductAndCategory{
  user?: User,
}

export const productAndCategory: ProductAndCategory[]
 = productsFromServer.map(product => ({
   ...product,
   category: categoriesFromServer
     .find(category => category.id === product.categoryId),
 }));
export const productWithUserAndCategory: ProductWithUserAndCategory[]
 = productAndCategory.map(product => ({
   ...product,
   user: usersFromServer.find(user => user.id === product.category?.ownerId),
 }));

export const App: React.FC = () => {
  const [preparedPoducts]
  = useState<ProductWithUserAndCategory[]>(productWithUserAndCategory);
  const [query, setQuery] = useState('');
  const [person, setPerson] = useState('');

  // const FilterUser = (user: User) => {
  //   const visibleProducts = preparedPoducts
  //     .filter(product => product.category?.ownerId === user.id);

  //   return setpreparedPoducts(visibleProducts);
  // };

  const resetFilter = () => (setQuery(''));

  const doesNameMatch = (product: ProductWithUserAndCategory) => {
    switch (person) {
      case 'Roma':
        return product?.user?.name === 'Roma';
      case 'Anna':
        return product?.user?.name === 'Anna';
      case 'Max':
        return product?.user?.name === 'Max';
      case 'John':
        return product?.user?.name === 'John';

      default:
        return preparedPoducts;
    }
  };

  const doesTitleMatch = (product: ProductWithUserAndCategory) => (product.name
    .toLowerCase().includes(query.toLowerCase().trim()));

  const veryVisible = preparedPoducts
    .filter(product => doesTitleMatch(product) && doesNameMatch(product));

  const resetAllFilter = () => {
    setQuery('');
    setPerson('');
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
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  onClick={() => setPerson(user.name)}
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
                  onChange={(event) => (setQuery(event.target.value))}

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
                      onClick={resetFilter}
                    />
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
                onClick={resetAllFilter}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>
        <div className="box table-container">
          {query && veryVisible.length === 0
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            ) : null}
          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            {veryVisible.length !== 0 && (
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
            )}

            <tbody>
              {veryVisible.map(product => (
                <tr data-cy="Product" key={product.id}>
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>
                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">{`${product.category?.icon} - ${product.category?.title}`}</td>
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
              ))}

              {/* <tr data-cy="Product">
                <td className="has-text-weight-bold" data-cy="ProductId">
                  2
                </td>

                <td data-cy="ProductName">Bread</td>
                <td data-cy="ProductCategory">🍞 - Grocery</td>

                <td
                  data-cy="ProductUser"
                  className="has-text-danger"
                >
                  Anna
                </td>
              </tr>

              <tr data-cy="Product">
                <td className="has-text-weight-bold" data-cy="ProductId">
                  3
                </td>

                <td data-cy="ProductName">iPhone</td>
                <td data-cy="ProductCategory">💻 - Electronics</td>

                <td
                  data-cy="ProductUser"
                  className="has-text-link"
                >
                  Roma
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
