import React, { useState } from 'react';
import './App.scss';
// import classNames from 'classnames';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

export enum SortType {
  ALL = 'all',
  ROMA = 'roma',
  ANNA = 'anna',
  MAX = 'max',
  JOHN = 'john',
}
export type User = {
  id: number,
  name: string,
  sex: string,
};

export type Product = {
  id: number,
  name: string,
  categoryId: number,
};

export type Categories = {
  id: number,
  title: string,
  icon: string,
  ownerId: number,
};

export type AllProducts = {
  id: number,
  title: string,
  icon: string,
  product: Product | null,
  user: User | null,
};

// export type CategoryWithOwner = {
//   id: number,
//   name: string,
//   sex: string,
//   category: Categories | null,
// };

// export const categoryWithOwner = usersFromServer.map(user => ({
//   ...user,
//   category: categoriesFromServer
//     .find(category => category.ownerId === user.id),
// }));

export const allProducts: AllProducts[] = categoriesFromServer.map(todo => ({
  ...todo,

  product: productsFromServer
    .find(product => product.categoryId === todo.id) || null,
  user: usersFromServer.find(user => user.id === todo.ownerId) || null,
}));

// export const allProducts1: AllProducts[] = productsFromServer.map(todo => ({
//   ...todo,
//   ...categoriesFromServer,
//   category: categoriesFromServer
//     .find(category => category.id === todo.categoryId) || null,
// }));

// export const allProducts2: AllProducts[] = allProducts1.map(todo => ({
//   ...todo,
//   user: usersFromServer
//     .filter(prod => prod.id === todo.user?.id) || null,
// }));

export const App: React.FC = () => {
  const [todos] = useState<AllProducts[]>(allProducts);
  const [query, setQuery] = useState('');
  const [sortType] = useState<SortType | string>(SortType.ALL);

  const filterTodos = () => {
    const sortedTodos = todos.filter(todo => {
      switch (sortType) {
        case SortType.ROMA:
          return todo.user?.name === 'Roma';
        case SortType.ANNA:
          return todo.user?.name === 'Anna';
        case SortType.MAX:
          return todo.user?.name === 'Max';
        case SortType.JOHN:
          return todo.user?.name === 'John';

        default:
          return todo;
      }
    });

    return sortedTodos.filter(todo => (
      todo.title.toLowerCase().includes(query.toLowerCase())
    ));
  };

  // const filterT = todos.filter(todo => (
  //   todo.product?.name.toLowerCase().includes(query.toLowerCase())
  // ));

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
              {allProducts.map(todo => (

                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={todo.user?.id}
                >
                  {todo.user?.name}
                </a>

              ))}

              {/* {allProducts.map(todo => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={todo.user?.id} */}
              {/* // value={sortType}
                // onChange={(event) => setSortType(event.target.value)}
                // className={classNames('TodoInfo', { */}
              {/* //   'TodoInfo--completed': todo.completed,
                // })}
              //   >
              //     {todo.user?.name}
              //   </a>
              // ))} */}
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
                    /* eslint-disable-next-line jsx-a11y/control-has-associated-label */
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
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
                onClick={() => setQuery('')}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {/* <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p> */}

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
              {filterTodos().map(todo => (
                <tr
                  data-cy="Product"
                  key={todo.product?.id}
                >
                  <td
                    className="has-text-weight-bold"
                    data-cy="ProductId"

                  >
                    {todo.product?.id}
                  </td>

                  <td data-cy="ProductName">{todo.product?.name}</td>
                  <td data-cy="ProductCategory">
                    {todo.icon}
                    -
                    {todo.title}
                  </td>

                  <td
                    data-cy="ProductUser"
                    className="has-text-link"
                  >
                    {todo.user?.name}
                  </td>
                </tr>
              ))}
              {/* <tr data-cy="Product">
                <td className="has-text-weight-bold" data-cy="ProductId">
                  1
                </td>

                <td data-cy="ProductName">Milk</td>
                <td data-cy="ProductCategory">🍺 - Drinks</td>

                <td
                  data-cy="ProductUser"
                  className="has-text-link"
                >
                  Max
                </td>
              </tr> */}

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
