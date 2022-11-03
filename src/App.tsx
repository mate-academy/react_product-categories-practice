import React, { FC, useState } from 'react';
import './App.scss';
import { FilterBlock } from './components/FilterBlock';
import { ProductsList } from './components/ProductsList';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';
import { Product } from './types/Product';
import { ExtendProduct } from './types/ExtendProduct';

const findCategory = (id: number) => {
  return categoriesFromServer.find(category => category.id === id) || null;
};

const extendProducts = productsFromServer
  .map((product: Product) => ({
    ...product,
    category: findCategory(product.categoryId) || null,
    user: usersFromServer.find(user => (
      user.id === findCategory(product.categoryId)?.ownerId
    )) || null,
  }));

export const App: FC = () => {
  const [
    visibleProducts,
    setVisibleProducts,
  ] = useState<ExtendProduct[]>(extendProducts);
  const [query, setQuery] = useState('');

  const changeProduct = (id: number) => {
    setVisibleProducts(extendProducts.filter(product => (
      id === product.category?.ownerId
    )));
  };

  const filteredProducts = visibleProducts.filter(product => (
    product.name.toLowerCase().includes(query.toLowerCase())
  ));

  const changeQuery = (event: React.ChangeEvent<HTMLInputElement>) => (
    setQuery(event.target.value)
  );

  const resetQuery = () => (
    setQuery('')
  );

  const resetProducts = () => setVisibleProducts(extendProducts);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <FilterBlock
          users={usersFromServer}
          change={changeProduct}
          reset={resetProducts}
          changeQuery={changeQuery}
          query={query}
          resetQuery={resetQuery}
        />

        <div className="box table-container">
          {filteredProducts.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            {filteredProducts.length > 0 && (
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

            <ProductsList products={filteredProducts} />
          </table>
        </div>
      </div>
    </div>
  );
};
