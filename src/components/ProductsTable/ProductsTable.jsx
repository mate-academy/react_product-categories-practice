import React from 'react';
import { useMemo, useCallback } from 'react';

export const ProductsTable = ({ itemArray, sort, setSort }) => {
  const headers = ['ID', 'Product', 'Category', 'User'];
  const handleSorting = useCallback(
    (type, ascOrder) => {
      setSort({ ...sort, type, ascOrder });
    },
    [sort, setSort],
  );

  const sortProducts = (products, type, ascOrder) => {
    switch (type) {
      case 'ID':
        return products.sort((a, b) => (ascOrder ? a.id - b.id : b.id - a.id));
      case 'Product':
        return products.sort((a, b) =>
          ascOrder
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name),
        );
      case 'Category':
        return products.sort((a, b) =>
          ascOrder
            ? a.category.title.localeCompare(b.category.title)
            : b.category.title.localeCompare(a.category.title),
        );
      case 'User':
        return products.sort((a, b) =>
          ascOrder
            ? a.user.name.localeCompare(b.user.name)
            : b.user.name.localeCompare(a.user.name),
        );
      default:
        return products;
    }
  };
  const sortedProducts = useMemo(
    () => sortProducts(itemArray, sort.type, sort.ascOrder),
    [itemArray, sort],
  );

  return itemArray.length === 0 ? (
    <p data-cy="NoMatchingMessage">No products matching selected criteria</p>
  ) : (
    <table
      data-cy="ProductTable"
      className="table is-striped is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          {headers.map(header => {
            let iconType = '';

            if (sort.type === header) {
              if (sort.ascOrder) {
                iconType = '-down';
              } else {
                iconType = '-up';
              }
            }

            return (
              <th>
                <span className="is-flex is-flex-wrap-nowrap">
                  {header}
                  <a
                    href="#/"
                    onClick={() => handleSorting(header, !sort.ascOrder)}
                  >
                    <span className="icon">
                      <i
                        data-cy="SortIcon"
                        className={`fas fa-sort${iconType}`}
                      />
                    </span>
                  </a>
                </span>
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {sortedProducts.map(item => (
          <tr data-cy="Product" key={item.id}>
            <td className="has-text-weight-bold" data-cy="ProductId">
              {item.id}
            </td>

            <td data-cy="ProductName">{item.name}</td>
            <td data-cy="ProductCategory">
              {item.category.icon} - {item.category.title}
            </td>

            <td data-cy="ProductUser" className="has-text-link">
              {item.user.name}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
