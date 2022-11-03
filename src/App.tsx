import React, { useState } from 'react';
import './App.scss';
import { User } from './types/user';
import { Category } from './types/categorie';
import { PreparedProduct } from './types/preparedProduct';

import { ProductFilter } from './Components/ProductFilter';
import { ProductTable } from './Components/ProductTable';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

const preparedProducts: PreparedProduct[] = productsFromServer.map(product => {
  const productCategory = categoriesFromServer.find(category => (
    category.id === product.categoryId)) as Category;

  const productUser = usersFromServer.find(user => (
    user.id === productCategory.ownerId)) as User;

  return {
    ...product,
    category: productCategory,
    user: productUser,
  };
});

export const App: React.FC = () => {
  const [products, setProducts] = useState<PreparedProduct[]>(preparedProducts);

  const filterProducts = (user: User | null, query: string) => {
    let filteredProducts;

    if (user === null) {
      filteredProducts = preparedProducts;
    } else {
      filteredProducts = preparedProducts.filter(product => (
        product.user === user
      ));
    }

    const appliedQuery = query.trim().toLowerCase();

    if (appliedQuery) {
      filteredProducts = filteredProducts.filter(product => (
        product.name.toLowerCase().includes(appliedQuery)
      ));
    }

    setProducts(filteredProducts);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <ProductFilter onFilter={filterProducts} />

        <ProductTable products={products} />

      </div>
    </div>
  );
};
