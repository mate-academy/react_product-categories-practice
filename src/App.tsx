import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';
// import { Product } from './types/Product';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';
import { Category } from './types/Category';
import { User } from './types/User';
import { FullProduct } from './types/FullProduct';
import { ProductsList } from './components/ProductsList';
import { SortType } from './types/SortType';
import { UsersTabs } from './components/UsersTabs';
import { Searchbar } from './components/Searchbar';
import { CategoryFilter } from './components/CategoryFilter';

function getProductsList():FullProduct[] {
  return productsFromServer
    .map(product => {
      const category: Category | null = categoriesFromServer
        .find(searchCategory => product.categoryId === searchCategory.id)
          || null;

      const user: User | null = category
        ? (
          usersFromServer.find(searchUser => searchUser.id === category.ownerId)
          || null
        )
        : null;

      const fullProduct: FullProduct = {
        id: product.id,
        name: product.name,
        category,
        user,
      };

      return fullProduct;
    });
}

export const App: React.FC = () => {
  const [productsList]
    = useState<FullProduct[]>(getProductsList());

  // FilterBy
  const [filterByUser, setFilterByUser] = useState(0);
  const [query, setQuery] = useState('');
  const [filtersByCategory, setFiltersByCategory] = useState<number[]>([]);

  // SoryBy
  const [sortBy, setSortBy] = useState<SortType>(SortType.None);
  const [isReverse, setIsReverse] = useState(false);

  const resetAllFilters = () => {
    setQuery('');
    setFilterByUser(0);
    setFiltersByCategory([]);
  };

  const handlerSetSortBy = (sortField: SortType) => {
    if (sortField === sortBy && isReverse) {
      setSortBy(SortType.None);
      setIsReverse(false);
    } else if (sortBy === sortField && !isReverse) {
      setSortBy(sortField);
      setIsReverse(true);
    } else {
      setSortBy(sortField);
    }
  };

  const filteredProductsList = productsList
    .filter(productByUser => {
      if (filterByUser > 0 && productByUser.user) {
        return productByUser.user.id === filterByUser;
      }

      return true;
    })
    .filter(productByQuery => {
      const normilizedQuery = query
        .trim()
        .split(' ')
        .filter(words => words !== '')
        .join(' ')
        .toLowerCase();

      const normilizedProductName = productByQuery.name.toLowerCase();

      return normilizedProductName.includes(normilizedQuery);
    })
    .filter(productsByCategory => {
      if (!filtersByCategory.length) {
        return true;
      }

      if (productsByCategory.category) {
        return filtersByCategory.includes(productsByCategory.category.id);
      }

      return false;
    })
    .sort((product1, product2) => {
      switch (sortBy) {
        case SortType.Product:
          return product1.name.localeCompare(product2.name);
        case SortType.Category:
          return (product1.category && product2.category)
            ? product1.category.title.localeCompare(product2.category.title)
            : 0;
        case SortType.User:
          return (product1.user && product2.user)
            ? product1.user.name.localeCompare(product2.user.name)
            : 0;
        case SortType.ID:
          return product1.id - product2.id;
        default:
          return 0;
      }
    });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <UsersTabs
              filterByUser={filterByUser}
              setFilterByUser={setFilterByUser}
            />

            <Searchbar
              query={query}
              setQuery={setQuery}
            />

            <CategoryFilter
              filtersByCategory={filtersByCategory}
              setFiltersByCategory={setFiltersByCategory}
            />

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetAllFilters}

              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProductsList.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {filteredProductsList.length > 0 && (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a
                        href="#/"
                        onClick={() => handlerSetSortBy(SortType.ID)}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={classNames(
                              'fas',
                              {
                                'fa-sort': sortBy !== SortType.ID,
                                'fa-sort-up': sortBy === SortType.ID
                                  && !isReverse,
                                'fa-sort-down': sortBy === SortType.ID
                                  && isReverse,
                              },
                            )}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product

                      <a
                        href="#/"
                        onClick={() => handlerSetSortBy(SortType.Product)}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={classNames(
                              'fas',
                              {
                                'fa-sort': sortBy !== SortType.Product,
                                'fa-sort-up': sortBy === SortType.Product
                                  && !isReverse,
                                'fa-sort-down': sortBy === SortType.Product
                                  && isReverse,
                              },
                            )}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category

                      <a
                        href="#/"
                        onClick={() => handlerSetSortBy(SortType.Category)}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={classNames(
                              'fas',
                              {
                                'fa-sort': sortBy !== SortType.Category,
                                'fa-sort-up': sortBy === SortType.Category
                                  && !isReverse,
                                'fa-sort-down': sortBy === SortType.Category
                                  && isReverse,
                              },
                            )}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User

                      <a
                        href="#/"
                        onClick={() => handlerSetSortBy(SortType.User)}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={classNames(
                              'fas',
                              {
                                'fa-sort': sortBy !== SortType.User,
                                'fa-sort-up': sortBy === SortType.User
                                  && !isReverse,
                                'fa-sort-down': sortBy === SortType.User
                                  && isReverse,
                              },
                            )}
                          />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <ProductsList
                productsList={!isReverse
                  ? filteredProductsList
                  : filteredProductsList.reverse()}
              />
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
