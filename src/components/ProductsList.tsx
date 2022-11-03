import React from 'react';
import classNames from 'classnames';

import { FullProduct } from '../types/FullProduct';

type Props = {
  productsList: FullProduct[]
};

export const ProductsList: React.FC<Props> = ({ productsList }) => {
  return (
    <tbody>
      {productsList.map(product => {
        const {
          id,
          name,
          category,
          user,
        } = product;

        if (category && user) {
          return (
            <tr data-cy="Product" key={id}>
              <td className="has-text-weight-bold" data-cy="ProductId">
                {id}
              </td>

              <td data-cy="ProductName">{name}</td>
              <td data-cy="ProductCategory">
                {`${category.icon} - ${category.title}`}
              </td>

              <td
                data-cy="ProductUser"
                className={classNames({
                  'has-text-link': user.sex === 'm',
                  'has-text-danger': user.sex === 'f',
                })}
              >
                {user.name}
              </td>
            </tr>
          );
        }

        return (<></>);
      })}
    </tbody>
  );
};
