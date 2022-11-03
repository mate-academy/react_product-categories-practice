import React, { useEffect, useState } from 'react';
import './App.scss';
import { ProductFilter } from './components/ProductFilter';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';
import { Product } from './types/Product';
import { Table } from './components/Table';
// import { SortType } from './types/SortType';

const products: Product[] = productsFromServer.map(product => {
  const categorieFromServer = categoriesFromServer.find(
    categorie => categorie.id === product.categoryId,
  ) || null;

  const userFromServer = usersFromServer.find(
    user => user.id === categorieFromServer?.ownerId,
  ) || null;

  return {
    ...product,
    category: categorieFromServer,
    user: userFromServer,
  };
});

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>(products);
  // const [sortField, setSortField] = useState(SortType.NONE);

  const filterBy = () => {
    const filterProducts = products.filter(({ name }) => {
      const nameToLowerCase = name.toLowerCase();
      const queryToLowerCase = query.toLowerCase();

      return nameToLowerCase.includes(queryToLowerCase);
    });

    if (selectedUser > 0) {
      return filterProducts.filter(({ user }) => selectedUser === user?.id);
    }

    return filterProducts;
  };

  const resetFilters = () => {
    setSelectedUser(0);
    setQuery('');
  };

  useEffect(() => {
    const filtered = filterBy();

    setVisibleProducts(filtered);
  }, [query, selectedUser]);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <ProductFilter
          query={query}
          setQuery={setQuery}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          resetFilters={resetFilters}
        />

        <Table
          products={visibleProducts}
        />
      </div>
    </div>
  );
};
