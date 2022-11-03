import { FC, useContext } from 'react';
import classNames from 'classnames';
import { AppContext } from '../AppProvider';

export const ProductTable: FC = () => {
  const {
    table,
    goods,
    sortId,
    setSortId,
    sortCount,
    setSortCount,
  } = useContext(AppContext);

  const handleSortBy = (current: string) => {
    if (sortId !== current) {
      setSortCount(1);
      setSortId(current);
    } else {
      let next = sortCount + 1;

      if (next > 2) {
        next = 0;
      }

      setSortCount(next);

      if (next === 0) {
        setSortId('ID');
      }
    }
  };

  return (
    <table
      data-cy="ProductTable"
      className="table is-striped is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          {table.map(header => {
            const isPassive = sortId !== header || sortCount === 0;
            const isUp = sortId === header && sortCount === 1;
            const isDown = sortId === header && sortCount === 2;

            return (
              <th key={header}>
                <span className="is-flex is-flex-wrap-nowrap">
                  {header}

                  <a
                    href="#/"
                    onClick={() => handleSortBy(header)}
                  >
                    <span className="icon">
                      <i
                        data-cy="SortIcon"
                        className={classNames(
                          'fas',
                          {
                            'fa-sort': isPassive,
                            'fa-sort-up': isUp,
                            'fa-sort-down': isDown,
                          },
                        )}
                      />
                    </span>
                  </a>
                </span>
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {goods.map(({
          id, name, categorie, owner,
        }) => (
          <tr key={id} data-cy="Product">
            <td className="has-text-weight-bold" data-cy="ProductId">
              {id}
            </td>

            <td data-cy="ProductName">
              {name}
            </td>
            <td data-cy="ProductCategory">
              {`${categorie?.icon} - ${categorie?.title}`}
            </td>

            <td
              data-cy="ProductUser"
              className={classNames(
                {
                  'has-text-link': owner?.sex === 'm',
                  'has-text-danger': owner?.sex === 'f',
                },
              )}
            >
              {owner?.name}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
