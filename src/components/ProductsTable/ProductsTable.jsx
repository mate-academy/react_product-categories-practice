import React from 'react';

export const ProductsTable = ({ itemArray, sort }) => {
  const headers = ['ID', 'Product', 'Category', 'User'];

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
                  <a href="#/">
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
        {itemArray.map(item => {
          return (
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
          );
        })}
      </tbody>
    </table>
  );
};
