import React from 'react';
import { Category } from '../../types';

type Props = {
  category: Category;
};

export const ProductCategory: React.FC<Props> = ({ category }) => (
  <td data-cy="ProductCategory">{`${category.icon} - ${category.title}`}</td>
);
