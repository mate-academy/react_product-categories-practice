import React from 'react';
import cn from 'classnames';

import { Category } from '../../react-app-env';

interface Props {
  categories: Category[];
  currentCategoryIds: number[];
  setCurrentCategoryIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const CategoriesFilter: React.FC<Props> = ({
  categories,
  currentCategoryIds,
  setCurrentCategoryIds,
}) => {
  const handleSelectionToggle = (categoryId: number) => {
    if (currentCategoryIds.includes(categoryId)) {
      const categoryIndex = currentCategoryIds.indexOf(categoryId);

      setCurrentCategoryIds(categoryIds => (
        categoryIds
          .slice(0, categoryIndex)
          .concat(categoryIds.slice(categoryIndex + 1))
      ));
    } else {
      setCurrentCategoryIds(categoryIds => ([
        ...categoryIds,
        categoryId,
      ]));
    }
  };

  const handleSelectionAll = () => {
    setCurrentCategoryIds([]);
  };

  return (
    <div className="panel-block is-flex-wrap-wrap">
      <a
        href="#/"
        data-cy="AllCategories"
        className={cn('button', 'is-success', 'mr-6', {
          'is-outlined': currentCategoryIds.length !== 0,
        })}
        onClick={handleSelectionAll}
      >
        All
      </a>

      {categories.map(({ title, id }) => (
        <a
          data-cy="Category"
          className={cn('button', 'mr-2', 'my-1', {
            'is-info': currentCategoryIds.includes(id),
          })}
          href="#/"
          key={id}
          onClick={() => handleSelectionToggle(id)}
        >
          {title}
        </a>
      ))}
    </div>
  );
};
