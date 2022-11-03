import { FC } from 'react';
import cn from 'classnames';
import { Product } from '../../types/Products';
import usersFromServer from '../../api/users';
import categoriesFromServer from '../../api/categories';

type Props = {
  products: Product[];
};

const getUserById = (userId: number | undefined) => (
  usersFromServer.find(({ id }) => id === userId)
);

const getCategoryById = (categoryId: number) => (
  categoriesFromServer.find(({ id }) => id === categoryId)
);

export const ProductList: FC<Props> = ({ products }) => (
  <table
    data-cy="ProductTable"
    className="table is-striped is-narrow is-fullwidth"
  >
    <thead>
      <tr>
        <th>
          <span className="is-flex is-flex-wrap-nowrap">
            ID

            <a href="#/">
              <span className="icon">
                <i data-cy="SortIcon" className="fas fa-sort" />
              </span>
            </a>
          </span>
        </th>

        <th>
          <span className="is-flex is-flex-wrap-nowrap">
            Product

            <a href="#/">
              <span className="icon">
                <i data-cy="SortIcon" className="fas fa-sort-down" />
              </span>
            </a>
          </span>
        </th>

        <th>
          <span className="is-flex is-flex-wrap-nowrap">
            Category

            <a href="#/">
              <span className="icon">
                <i data-cy="SortIcon" className="fas fa-sort-up" />
              </span>
            </a>
          </span>
        </th>

        <th>
          <span className="is-flex is-flex-wrap-nowrap">
            User

            <a href="#/">
              <span className="icon">
                <i data-cy="SortIcon" className="fas fa-sort" />
              </span>
            </a>
          </span>
        </th>
      </tr>
    </thead>

    <tbody>
      {products.map(({ id, name, categoryId }) => {
        const category = getCategoryById(categoryId);
        const user = getUserById(category?.ownerId);

        return (
          <tr data-cy="Product" key={id}>
            <td className="has-text-weight-bold" data-cy="ProductId">
              {id}
            </td>

            <td data-cy="ProductName">{name}</td>
            <td data-cy="ProductCategory">
              {`${category?.icon} - ${category?.title}`}
            </td>

            <td
              data-cy="ProductUser"
              className={cn(
                {
                  'has-text-link': user?.sex === 'm',
                  'has-text-danger': user?.sex === 'f',
                },
              )}
            >
              {user?.name}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);
