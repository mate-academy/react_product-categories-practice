import classNames from 'classnames';
import { User } from '../react-app-env';

type Props = {
  user: User,
};

export const ProductUser: React.FC<Props> = ({ user }) => {
  const { name, sex } = user;

  return (
    <td
      data-cy="ProductUser"
      className={classNames({
        'has-text-danger': sex === 'f',
        'has-text-link': sex === 'm',
      })}
    >
      {name}
    </td>
  );
};
