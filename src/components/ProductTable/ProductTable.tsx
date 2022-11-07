import React from 'react';
import cn from 'classnames';
import { Product, SortField } from '../../types';
import { ProductCategory } from '../ProductCategory';
import { ProductUser } from '../ProductUser';

type Props = {
  products: Product[];
  handleSortByChange: (newSortBy: SortField) => void;
  sortBy: SortField;
  isReversed: boolean;
};

export const ProductTable: React.FC<Props> = ({
  products,
  handleSortByChange,
  sortBy,
  isReversed,
}) => (
  <table
    data-cy="ProductTable"
    className="table is-striped is-narrow is-fullwidth"
  >
    <thead>
      <tr>
        <th>
          <span className="is-flex is-flex-wrap-nowrap">
            ID

            <a href="#/" onClick={() => handleSortByChange(SortField.ID)}>
              <span className="icon">
                <i
                  data-cy="SortIcon"
                  className={cn('fas', {
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

            <a href="#/" onClick={() => handleSortByChange(SortField.Product)}>
              <span className="icon">
                <i
                  data-cy="SortIcon"
                  className={cn('fas', {
                    'fa-sort': sortBy !== SortField.Product,
                    'fa-sort-up': sortBy === SortField.Product && !isReversed,
                    'fa-sort-down': sortBy === SortField.Product && isReversed,
                  })}
                />
              </span>
            </a>
          </span>
        </th>

        <th>
          <span className="is-flex is-flex-wrap-nowrap">
            Category

            <a href="#/" onClick={() => handleSortByChange(SortField.Category)}>
              <span className="icon">
                <i
                  data-cy="SortIcon"
                  className={cn('fas', {
                    'fa-sort': sortBy !== SortField.Category,
                    'fa-sort-up': sortBy === SortField.Category && !isReversed,
                    'fa-sort-down': sortBy === SortField.Category && isReversed,
                  })}
                />
              </span>
            </a>
          </span>
        </th>

        <th>
          <span className="is-flex is-flex-wrap-nowrap">
            User

            <a href="#/" onClick={() => handleSortByChange(SortField.User)}>
              <span className="icon">
                <i
                  data-cy="SortIcon"
                  className={cn('fas', {
                    'fa-sort': sortBy !== SortField.User,
                    'fa-sort-up': sortBy === SortField.User && !isReversed,
                    'fa-sort-down': sortBy === SortField.User && isReversed,
                  })}
                />
              </span>
            </a>
          </span>
        </th>
      </tr>
    </thead>

    <tbody>
      {products.map(product => (
        <tr data-cy="Product" key={product.id}>
          <td className="has-text-weight-bold" data-cy="ProductId">
            {product.id}
          </td>

          <td data-cy="ProductName">{product.name}</td>
          {product.category && (
            <ProductCategory category={product.category} />
          )}

          {product.user && (
            <ProductUser user={product.user} />
          )}
        </tr>
      ))}
    </tbody>
  </table>
);
