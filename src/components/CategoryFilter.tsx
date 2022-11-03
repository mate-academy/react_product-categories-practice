import React from 'react';
import classNames from 'classnames';

import categoriesFromServer from '../api/categories';

type Props = {
  filtersByCategory: number[],
  setFiltersByCategory: React.Dispatch<React.SetStateAction<number[]>>,
};

export const CategoryFilter: React.FC<Props> = ({
  filtersByCategory,
  setFiltersByCategory,
}) => {
  return (
    <div className="panel-block is-flex-wrap-wrap">
      <a
        href="#/"
        data-cy="AllCategories"
        className={classNames(
          'button',
          'is-success',
          'mr-6',
          {
            'is-outlined': filtersByCategory.length !== 0,
          },
        )}
        onClick={() => {
          setFiltersByCategory([]);
        }}
      >
        All
      </a>

      {categoriesFromServer.map(category => {
        const { id, title } = category;

        return (
          <a
            data-cy="Category"
            className={classNames(
              'button',
              'mr-1',
              'my-1',
              {
                'is-info': filtersByCategory.includes(id),
              },
            )}
            href="#/"
            key={id}
            onClick={() => {
              setFiltersByCategory(currentFilters => {
                if (!filtersByCategory.includes(id)) {
                  return ([
                    ...currentFilters,
                    id,
                  ]);
                }

                return currentFilters
                  .filter(categoryId => categoryId !== id);
              });
            }}
          >
            {title}
          </a>
        );
      })}
    </div>
  );
};
