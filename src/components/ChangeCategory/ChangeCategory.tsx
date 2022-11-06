/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames';
import React, { useCallback } from 'react';
import { Category } from '../../types/category';

interface Props {
  categories: Category[],
  selectedCategoryIds: number[],
  setSelectedCategoryIds: (categoryIds: number[]) => void,
}

export const ChangeCategory: React.FC<Props> = ({
  categories,
  selectedCategoryIds,
  setSelectedCategoryIds,
}) => {
  const handleCategoryChange = useCallback((
    categoryId: number,
    isCategorySelected: boolean,
  ) => {
    if (isCategorySelected) {
      setSelectedCategoryIds(selectedCategoryIds.filter(
        category => category !== categoryId,
      ));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
    }
  }, [selectedCategoryIds]);

  return (
    <div className="panel-block is-flex-wrap-wrap">
      <a
        href="#/"
        data-cy="AllCategories"
        className={classNames('button is-success mr-6', {
          'is-outlined': selectedCategoryIds.length !== 0,
        })}
        onClick={() => setSelectedCategoryIds([])}
      >
        All
      </a>

      {categories.map(category => {
        const {
          id,
          title,
        } = category;
        const isCategorySelected = selectedCategoryIds.includes(id);

        return (
          <a
            data-cy="Category"
            key={id}
            className={classNames('button mr-2 my-1', {
              'is-info': isCategorySelected,
            })}
            href="#/"
            onClick={() => handleCategoryChange(id, isCategorySelected)}
          >
            {title}
          </a>
        );
      })}
    </div>
  );
};
