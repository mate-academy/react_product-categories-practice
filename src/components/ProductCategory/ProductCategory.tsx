import React from 'react';
import { Category } from '../../types/category';

interface Props {
  category: Category,
}

export const ProductCategory: React.FC<Props> = ({ category }) => {
  const {
    icon,
    title,
  } = category;

  return (
    <td data-cy="ProductCategory">{`${icon} - ${title}`}</td>
  );
};
