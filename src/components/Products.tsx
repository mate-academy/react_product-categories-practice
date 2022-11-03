import { ProductWithCategory } from '../react-app-env';
import { ProductCategory } from './ProductCategory';
import { ProductUser } from './ProductUser';

type Props = {
  product: ProductWithCategory,
};

export const Products: React.FC<Props> = ({ product }) => {
  const {
    id,
    name,
    category,
    user,
  } = product;

  return (
    <tr data-cy="Product">
      <td className="has-text-weight-bold" data-cy="ProductId">
        {id}
      </td>

      <td data-cy="ProductName">{name}</td>
      {category
        ? <ProductCategory category={category} />
        : 'No category'}

      {user
        ? <ProductUser user={user} />
        : 'No user'}
    </tr>
  );
};
