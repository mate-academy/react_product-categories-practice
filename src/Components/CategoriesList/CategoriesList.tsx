import React from 'react';
import { FullProduct } from '../../react-app-env';
import { CategoriesInfo } from '../CategoriesInfo/CategoriesInfo';
import '../../App.scss';

type Props = {
  products: FullProduct[],
};

export const CategoriesList: React.FC<Props> = ({ products }) => {
  return (
    <tbody>
      {
        products.map(item => (
          <tr data-cy="Product" key={item.id}>
            <CategoriesInfo product={item} />
          </tr>
        ))
      }
    </tbody>
  );
};
