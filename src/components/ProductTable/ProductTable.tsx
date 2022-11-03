import { FC } from 'react';
import cn from 'classnames';
import { FullList } from '../../types';

type Props = {
  fullList: FullList[];
};

export const ProductTable: FC<Props> = ({ fullList }) => {
  return (
    <table
      data-cy="ProductTable"
      className="table is-striped is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              ID

              <a href="src/components/ProductTable/ProductTable#/">
                <span className="icon">
                  <i data-cy="SortIcon" className="fas fa-sort" />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Product

              <a href="src/components/ProductTable/ProductTable#/">
                <span className="icon">
                  <i data-cy="SortIcon" className="fas fa-sort-down" />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Category

              <a href="src/components/ProductTable/ProductTable#/">
                <span className="icon">
                  <i data-cy="SortIcon" className="fas fa-sort-up" />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              User

              <a href="src/components/ProductTable/ProductTable#/">
                <span className="icon">
                  <i data-cy="SortIcon" className="fas fa-sort" />
                </span>
              </a>
            </span>
          </th>
        </tr>
      </thead>

      <tbody>
        {fullList.map(item => (
          <tr data-cy="Product" key={item.id}>
            <td className="has-text-weight-bold" data-cy="ProductId">
              {item.id}
            </td>

            <td data-cy="ProductName">{item.name}</td>
            <td data-cy="ProductCategory">{`${item.icon} - ${item.title}`}</td>

            <td
              data-cy="ProductUser"
              className={cn({
                'has-text-link': item.sex === 'm',
                'has-text-danger': item.sex === 'f',
              })}
            >
              {item.userName}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
