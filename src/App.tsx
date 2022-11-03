import React, { useEffect, useState } from 'react';
import './App.scss';
import { ProductTable } from './components/ProductTable';
import { Panel } from './components/Panel';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';
import { FullList, Users } from './types';

const setProductsWithUsersAndCatigories = (): FullList[] | null => {
  return productsFromServer.map(product => {
    const category = categoriesFromServer
      .find(cat => cat.id === product.categoryId);

    if (category) {
      const foundUser = usersFromServer
        .find(user => user.id === category.ownerId);

      if (foundUser) {
        return ({
          ...product,
          title: category.title,
          icon: category.icon,
          userName: foundUser.name,
          sex: foundUser.sex,
        });
      }
    }

    return ({
      id: null,
      name: null,
      categoryId: null,
      title: null,
      icon: null,
      userName: null,
      sex: null,
    });
  });
};

export const App: React.FC = () => {
  const [fullList, setFullList] = useState<FullList[] | null>(null);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [visibleList, setVisibleList] = useState<FullList[] | null>(null);
  const [query, setQuery] = useState('');

  const filterBySelectedUser = () => {
    setVisibleList(() => {
      if (selectedUser === null && query === '') {
        return setProductsWithUsersAndCatigories();
      }

      return fullList?.filter(item => {
        if (item.userName && selectedUser) {
          return item.userName === selectedUser?.name;
        }

        return false;
      }).filter(item => {
        console.log('here');
        if (item.name) {
          return item.name.includes(query);
        }

        return false;
      }) || null;
    });
  };

  useEffect(() => {
    setFullList(setProductsWithUsersAndCatigories());
    setVisibleList(setProductsWithUsersAndCatigories());
  }, []);

  useEffect(() => {
    filterBySelectedUser();
  }, [selectedUser, query]);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <Panel
            users={usersFromServer}
            catigories={categoriesFromServer}
            setSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
            setQuery={setQuery}
          />
        </div>

        <div className="box table-container">
          {visibleList?.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {visibleList && (
            <ProductTable fullList={visibleList} />
          )}
        </div>
      </div>
    </div>
  );
};
