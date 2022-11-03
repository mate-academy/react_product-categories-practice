import React from 'react';
import cn from 'classnames';

import {
  ProductComplete,
} from '../../react-app-env';

interface Props {
  products: ProductComplete[];
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  isSortReversed: boolean;
  setIsSortReversed: React.Dispatch<React.SetStateAction<boolean>>;
}

const sortingOptions = ['ID', 'Product', 'Category', 'User'];

export const ProductsTable: React.FC<Props> = ({
  products,
  sortBy,
  setSortBy,
  isSortReversed,
  setIsSortReversed,
}) => {
  const handleSortingSelection = (sortingOption: string) => {
    if (sortingOption === sortBy) {
      if (isSortReversed) {
        setIsSortReversed(false);
        setSortBy('');
      } else {
        setIsSortReversed(true);
      }
    } else {
      setSortBy(sortingOption);
      setIsSortReversed(false);
    }
  };

  return (
    <table
      data-cy="ProductTable"
      className="table is-striped is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          {sortingOptions.map(sortingOption => (
            <th>
              <span className="is-flex is-flex-wrap-nowrap">
                {sortingOption}

                <a
                  href="#/"
                  onClick={() => handleSortingSelection(sortingOption)}
                >
                  <span className="icon">
                    <i
                      data-cy="SortIcon"
                      className={cn('fas', {
                        'fa-sort': sortingOption !== sortBy,
                        'fa-sort-up': sortingOption === sortBy
                          && !isSortReversed,
                        'fa-sort-down': sortingOption === sortBy
                          && isSortReversed,
                      })}
                    />
                  </span>
                </a>
              </span>
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {products.map(({
          id,
          name,
          category,
          user,
        }) => (
          <tr data-cy="Product" key={id}>
            <td className="has-text-weight-bold" data-cy="ProductId">
              {id}
            </td>

            <td data-cy="ProductName">{name}</td>
            <td data-cy="ProductCategory">{`${category?.icon} - ${category?.title}`}</td>

            <td
              data-cy="ProductUser"
              className={cn({
                'has-text-link': user?.sex === 'm',
                'has-text-danger': user?.sex === 'f',
              })}
            >
              {user?.name}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
