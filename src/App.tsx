import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';
// import { User } from './types/user';
import { Users } from './components/Users';
import { ProductWithUserWithCategories }
  from './types/ProductWithUserWithCategories';
// import { Categories } from './types/categories';
// import { Product } from './types/product';
import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

const productWithUserWithCategories: ProductWithUserWithCategories[]
  = productsFromServer
    .map((product) => ({
      ...product,
      categories: categoriesFromServer.find(
        (categoria) => categoria.id === product.categoryId,
      ),
    }))
    .map((productWithCategory) => ({
      ...productWithCategory,
      user: usersFromServer.find(
        (user) => user.id === productWithCategory.categories?.ownerId,
      ),
    }));

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [visibleProducts, setVIsibleProducts]
    = useState(productWithUserWithCategories);

  const filterByUser = (id: number) => {
    setVIsibleProducts(productWithUserWithCategories.filter(product => {
      return id === product.categories?.ownerId;
    }));
  };

  const changeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const resetQuery = () => {
    setQuery('');
  };

  const resetProducts = () => setVIsibleProducts(productWithUserWithCategories);

  const filteredByname = visibleProducts.filter(product => (
    product.name.toLowerCase().includes(query.toLowerCase())
  ));

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <Users
          users={usersFromServer}
          filterByUser={filterByUser}
          query={query}
          changeQuery={changeQuery}
          resetQuery={resetQuery}
          reset={resetProducts}
        />

        <div className="box table-container">
          {filteredByname.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

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
              {filteredByname.map((categ) => (
                <tr data-cy="Product" key={categ.id}>
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {categ.id}
                  </td>

                  <td data-cy="ProductName">{categ.name}</td>
                  <td data-cy="ProductCategory">{`${categ.categories?.icon} - ${categ.categories?.title}`}</td>

                  <td
                    data-cy="ProductUser"
                    className={cn(
                      {
                        'has-text-link': categ.user?.sex === 'm',
                        'has-text-danger': categ.user?.sex === 'f',
                      },
                    )}
                  >
                    {categ.user?.name}
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
