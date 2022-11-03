import { FC, useContext } from 'react';
import classNames from 'classnames';
import { AppContext } from '../AppProvider';

export const UserFilters: FC = () => {
  const {
    users,
    choosenUser,
    setChoosenUser,
  } = useContext(AppContext);

  const handleUserChoose = (currentUser: string) => {
    setChoosenUser(currentUser);
  };

  return (
    <p className="panel-tabs has-text-weight-bold">
      <a
        data-cy="FilterAllUsers"
        className={classNames(
          { 'is-active': choosenUser === 'all' },
        )}
        href="#/"
        onClick={() => handleUserChoose('all')}
      >
        All
      </a>
      {users.map(({ id, name }) => (
        <a
          data-cy="FilterUser"
          href="#/"
          key={id}
          className={classNames(
            { 'is-active': choosenUser === name },
          )}
          onClick={() => handleUserChoose(name)}
        >
          {name}
        </a>
      ))}
    </p>
  );
};
