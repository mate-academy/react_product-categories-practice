import React, { useCallback } from 'react';
import classNames from 'classnames';

import { Product } from '../../types/product';
import { SortField } from '../../types/SortField';

import { ProductCategory } from '../ProductCategory';
import { ProductUser } from '../ProductUser';

interface Props {
  products: Product[],
  sortBy: SortField,
  setSortBy: (field: SortField) => void,
  isReversed: boolean,
  setIsReversed: (status: boolean) => void,
}

export const ProductTable: React.FC<Props> = ({
  products,
  sortBy,
  setSortBy,
  isReversed,
  setIsReversed,
}) => {
  const handleSortByChange = useCallback((newSortBy: SortField) => {
    if (newSortBy !== sortBy) {
      setSortBy(newSortBy);
      setIsReversed(false);
    } else if (!isReversed) {
      setIsReversed(true);
    } else {
      setSortBy(SortField.NONE);
      setIsReversed(false);
    }
  }, [sortBy, isReversed]);

  return (
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
                onClick={() => handleSortByChange(SortField.ID)}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={classNames('fas', {
                      'fa-sort': sortBy !== SortField.ID,
                      'fa-sort-up': sortBy === SortField.ID && !isReversed,
                      'fa-sort-down': sortBy === SortField.ID && isReversed,
                    })}
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
                onClick={() => handleSortByChange(SortField.PRODUCT)}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={classNames('fas', {
                      'fa-sort': sortBy !== SortField.PRODUCT,
                      'fa-sort-up': sortBy === SortField.PRODUCT
                        && !isReversed,
                      'fa-sort-down': sortBy === SortField.PRODUCT
                        && isReversed,
                    })}
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
                onClick={() => handleSortByChange(SortField.CATEGORY)}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={classNames('fas', {
                      'fa-sort': sortBy !== SortField.CATEGORY,
                      'fa-sort-up': sortBy === SortField.CATEGORY
                        && !isReversed,
                      'fa-sort-down': sortBy === SortField.CATEGORY
                        && isReversed,
                    })}
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
                onClick={() => handleSortByChange(SortField.USER)}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={classNames('fas', {
                      'fa-sort': sortBy !== SortField.USER,
                      'fa-sort-up': sortBy === SortField.USER && !isReversed,
                      'fa-sort-down': sortBy === SortField.USER && isReversed,
                    })}
                  />
                </span>
              </a>
            </span>
          </th>
        </tr>
      </thead>

      <tbody>
        {products.map(product => {
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
              {category && (
                <ProductCategory category={category} />
              )}

              {user && (
                <ProductUser user={user} />
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
