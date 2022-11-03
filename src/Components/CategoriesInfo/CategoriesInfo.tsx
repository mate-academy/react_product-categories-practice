import React from 'react';
import classNames from 'classnames';
import { FullProduct } from '../../react-app-env';
import '../../App.scss';

type Props = {
  product: FullProduct;
};

export const CategoriesInfo: React.FC<Props> = ({ product }) => {
  return (
    <>
      <td className="has-text-weight-bold" data-cy="ProductId">
        {product.id}
      </td>

      <td data-cy="ProductName">{product.name}</td>
      <td
        data-cy="ProductCategory"
      >
        {`${product.cattegories?.icon} - ${product.cattegories?.title}`}
      </td>

      <td
        data-cy="ProductUser"
        className={classNames({
          'has-text-link': product.user?.sex === 'm',
          'has-text-danger': product.user?.sex === 'f',
        })}
      >
        {product.user?.name}
      </td>
    </>
  );
};
