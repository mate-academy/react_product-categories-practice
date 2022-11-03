import { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

// import { Product } from './types/Product';
import { User } from './types/User';
// import { Categories } from './types/Categories';

function findUser(userId:number | undefined):User | null {
  const foundUser = usersFromServer.find(user => user.id === userId);

  return foundUser || null;
}

function findCategory(Id:number): any {
  const foundCategory = categoriesFromServer.find(categories => (
    categories.id === Id));

  const foundCategoiesAndUser = {
    ...foundCategory,
    user: findUser(foundCategory?.ownerId),
  };

  return foundCategoiesAndUser || null;
}

const productList = productsFromServer.map((product) => {
  return {
    ...product,
    category: findCategory(product.categoryId),
  };
});

export const App: React.FC = () => {
  // const [filtredList, setFiltredList] = useState(productList);
  const [sortType, setSortType] = useState([0]);
  const [sortByUsers, setSortByUsers] = useState([0]);

  const heandlerAll = () => {
    if (sortType.includes(0)) {
      setSortType(current => (current.filter(typ => (
        typ !== 0
      ))));
    } else {
      setSortType([0]);
    }
  };

  const handlerSortType = (type:number) => {
    if (sortType.includes(type)) {
      setSortType(current => (current.filter(typ => (
        typ !== type
      ))));
    } else {
      setSortType(current => (
        [...current, type]
      ));
    }
  };

  const handlerSortByUsers = (type:number) => {
    if (sortByUsers.includes(type)) {
      setSortByUsers(current => (current.filter(typ => (
        typ !== type
      ))));
    } else {
      setSortByUsers(current => (
        [...current, type]
      ));
    }
  };

  // const filtedListByUser = productList.filter(product => (
  //   sortType.includes(product.category.ownerId)));

  const filtredList = sortType.includes(0)
    ? productList
    : productList.filter(product => {
      return sortType.includes(product.categoryId);
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
                onClick={heandlerAll}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => handlerSortByUsers(user.id)}
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
                  value="qwe"
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => handlerSortType(0)}
              >
                All
              </a>

              {categoriesFromServer.map(categories => (
                <a
                  data-cy="Category"
                  className={classNames('button', {
                    'is-active': sortType.includes(categories.id),
                  })}
                  onClick={() => handlerSortType(categories.id)}
                  href="#/"
                >
                  {categories.title}
                </a>
              ))}
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
              {filtredList.map(products => (
                <tr data-cy="Product">
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {products.id}
                  </td>

                  <td data-cy="ProductName">{products.name}</td>
                  <td data-cy="ProductCategory">
                    {`${products.category.icon} - ${products.category.title}`}
                  </td>

                  <td
                    data-cy="ProductUser"
                    className={classNames({
                      'has-text-danger': products.category.user.sex === 'f',
                      'has-text-link': products.category.user.sex === 'm',
                    })}
                  >
                    {products.category.user.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
