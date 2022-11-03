import { FC } from "react";
import classNames from "classnames";
import { Product } from "../../Types";

type Props = {
  product: Product;
};

export const ProductCard: FC<Props> = ({ product }) => {
  const { name, id, user, category } = product;

  return (
    <tr data-cy="Product">
      <td className="has-text-weight-bold" data-cy="ProductId">
        {id}
      </td>

      <td data-cy="ProductName">{name}</td>
      <td data-cy="ProductCategory">{`${category?.icon} - ${category?.title}`}</td>

      <td
        data-cy="ProductUser"
        className={classNames("has-text-link", {
          "has-text-danger": user?.sex === "f",
        })}
      >
        {user?.name}
      </td>
    </tr>
  );
};
