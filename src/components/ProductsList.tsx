import React from 'react';
import { FullProduct } from '../types/Product';

type Props = {
  products: FullProduct[],
};

export const ProductsList: React.FC<Props> = (
  { products },
) => {
  return (
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
          {products.map(product => {
            return (
              <tr data-cy="Product">
                <td className="has-text-weight-bold" data-cy="ProductId">
                  {product.id}
                </td>

                <td data-cy="ProductName">{product.name}</td>
                <td data-cy="ProductCategory">
                  {product.category && `${product.category.icon} - ${product.category.title}` }
                </td>

                <td
                  data-cy="ProductUser"
                  className="has-text-link"
                >
                  { product.category
                    && product.category.user
                    && product.category.user.name}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
