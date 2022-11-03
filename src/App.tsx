import React, { useEffect, useState } from 'react';
import './App.scss';

import classNames from 'classnames';
import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';
import { ProductWithUser } from './types/productWithUser';
import { User } from './types/user';
import { Category } from './types/Category';
// import {SortBy} from "./types/SortBy";

const getProducts = (): ProductWithUser[] => {
  return productsFromServer.map(product => {
    const currentCategory = categoriesFromServer
      .find(item => item.id === product.categoryId);
    const currentUser = usersFromServer
      .find(item => item.id === currentCategory?.ownerId);

    return {
      ...product,
      category: currentCategory,
      user: currentUser,
    };
  });
};

export const App: React.FC = () => {
  // Main products states:
  const [products, setProducts] = useState<ProductWithUser[] | null>(null);
  const [visibleProducts, setVisibleProducts]
    = useState<ProductWithUser[] | null>(null);
  // Owners filter states:
  const [allOwners, setAllOwners] = useState<User[] | null>(null);
  const [owner, setOwner] = useState(0);
  // Qwery filter state:
  const [qwery, setQwery] = useState('');
  // Categories filter states:
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [allCategories, setAllCategories] = useState<Category[] | null>(null);
  // Sorting by states:
  // NOT FINISHED YET***
  // const [sortBy, setSortBy] = useState<SortBy>(SortBy.NONE);
  // const [sortByCounter, setSortByCounter] = useState(0);

  useEffect(() => {
    setProducts(getProducts());
    setAllOwners(usersFromServer);
    setCategories(categoriesFromServer);
    setAllCategories(categoriesFromServer);
  }, []);

  useEffect(() => {
    const filteredProducts = products?.filter(product => {
      if (owner === 0) {
        return product;
      }

      return product.user?.id === owner;
    }).filter(product => {
      if (qwery === '') {
        return product;
      }

      return product.name.toLowerCase().match(qwery.toLowerCase());
    }).filter(product => {
      if (!categories || !categories.length) {
        return false;
      }

      return categories
        .some(categoryItem => categoryItem.id === product.category?.id);
    });
    //   .sort((prev: ProductWithUser, curr: ProductWithUser) => {
    //   return sortBy === SortBy.NONE ? 0 : prev?[sortBy] - curr?[sortBy];
    // });

    setVisibleProducts(filteredProducts || null);
  }, [products, owner, qwery, categories]);

  const categorySelectHandler = (
    categoryItem: Category, isCategory: boolean,
  ) => {
    if (isCategory) {
      setCategories(prevState => {
        return prevState?.filter(categorieFilter => (
          categorieFilter.id !== categoryItem.id
        )) || null;
      });

      return null;
    }

    setCategories(prevState => {
      return prevState
        ? [...prevState, categoryItem]
        : [categoryItem];
    });

    return null;
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
                className={classNames({
                  'is-active': owner === 0,
                })}
                onClick={() => setOwner(0)}
              >
                All
              </a>

              {allOwners?.map(ownerUser => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({
                    'is-active': ownerUser.id === owner,
                  })}
                  onClick={() => setOwner(ownerUser.id)}
                >
                  {ownerUser.name}
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
                  value={qwery}
                  onChange={(e) => setQwery(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {qwery.length > 0 && (
                    <>
                      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                      <button
                        data-cy="ClearButton"
                        type="button"
                        className="delete"
                        onClick={() => setQwery('')}
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
                className={classNames('button is-success mr-6', {
                  'is-outlined': categories?.length !== 0,
                })}
                onClick={() => setCategories(allCategories)}
              >
                All
              </a>

              {allCategories?.map(categoryItem => {
                const isCategory = categories?.some(itm => (
                  itm.id === categoryItem.id
                )) || false;

                return (
                  <a
                    data-cy="Category"
                    className={classNames('button mr-2 my-1', {
                      'is-info': isCategory,
                    })}
                    onClick={() => (
                      categorySelectHandler(categoryItem, isCategory)
                    )}
                    href="#/"
                  >
                    {categoryItem.title}
                  </a>
                );
              })}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setQwery('');
                  setOwner(0);
                  setCategories(allCategories);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts?.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {visibleProducts?.length !== 0 && (
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

                {visibleProducts?.map(product => {
                  const {
                    id,
                    name,
                    category,
                    user,
                  } = product;

                  return (
                    <tr data-cy="Product" key={id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {id}
                      </td>

                      <td data-cy="ProductName">{name}</td>
                      <td data-cy="ProductCategory">
                        {`${category?.icon} - ${category?.title}`}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={classNames({
                          'has-text-link': user?.sex === 'm',
                          'has-text-danger': user?.sex === 'f',
                        })}
                      >
                        {user?.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
