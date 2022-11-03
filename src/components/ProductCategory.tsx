import { Category } from '../react-app-env';

type Props = {
  category: Category,
};

export const ProductCategory: React.FC<Props> = ({ category }) => {
  const { title, icon } = category;

  return (
    <td data-cy="ProductCategory">{`${icon} - ${title}`}</td>
  );
};
