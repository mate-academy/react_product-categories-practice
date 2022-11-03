import { FC, useState } from 'react';
import './App.scss';

import productsFromServer from './api/products';
import { Product } from './types/Products';
import { ProductList } from './components/ProductsList';
import { ProductsFilter } from './components/ProducsFilter';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';

const getUserById = (userId: number | undefined) => (
  usersFromServer.find(({ id }) => id === userId)
);

const getCategoryById = (categoryId: number) => (
  categoriesFromServer.find(({ id }) => id === categoryId)
);

export const App: FC = () => {
  const [products, setProducts] = useState<Product[]>(productsFromServer);

  const filterByUser = (userId: number) => (
    productsFromServer.filter(({ categoryId }) => {
      const category = getCategoryById(categoryId);
      const user = getUserById(category?.ownerId);

      if (userId === 0 || user === undefined) {
        return true;
      }

      return user.id === userId;
    }));

  const handleUserFilter = (userId: number) => {
    setProducts(filterByUser(userId));
  };

  const handleQueryFilter = (query: string) => {
    setProducts(productsFromServer.filter(({ name }) => {
      const normalizedQuery = query.toLowerCase();
      const normalizedName = name.toLowerCase();

      return normalizedName.includes(normalizedQuery);
    }));
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <ProductsFilter
          handleUserFilter={handleUserFilter}
          handleQueryFilter={handleQueryFilter}
        />

        <div className="box table-container">
          {!products.length ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <ProductList
              products={products}
            />
          )}
        </div>
      </div>
    </div>
  );
};
