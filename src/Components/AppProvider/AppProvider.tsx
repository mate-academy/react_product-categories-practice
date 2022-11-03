import React, { useState, useEffect } from 'react';
import usersFromServer from '../../api/users';
import productsFromServer from '../../api/products';
import categoriesFromServer from '../../api/categories';
import { Product } from '../../Types/Product';
import { User } from '../../Types/User';
import { Category } from '../../Types/Category';
import { Good } from '../../Types/Good';

const getCategory = (categories: Category[], categorieId: number) => {
  return categories.find(categorie => categorie.id === categorieId);
};

const getOwner = (users: User[], current: Category | undefined) => {
  return users.find(user => user.id === current?.ownerId);
};

const connectData = (products: Product[]) => {
  return products.map((product) => {
    const currentCategorie = getCategory(
      categoriesFromServer,
      product.categoryId,
    );
    const currentOwner = getOwner(
      usersFromServer,
      currentCategorie,
    );

    return {
      ...product,
      categorie: currentCategorie,
      owner: currentOwner,
    };
  });
};

const tableHeader: string[] = ['ID', 'Product', 'Category', 'User'];

const productsList = connectData(productsFromServer);

type Props = {
  children: React.ReactNode;
};

type Context = {
  table: string[],
  users: User[],
  categories: Category[],
  goods: Good[],
  choosenUser: string,
  setChoosenUser: (user: string) => void,
  choosenCategories: string[],
  setChoosenCategories: (categories: string[]) => void,
  query: string,
  setQuery: (newQuery: string) => void,
  sortId: string,
  setSortId: (newPos: string) => void,
  sortCount: number,
  setSortCount: (newNumber: number) => void,
};

export const AppContext = React.createContext<Context>({
  table: tableHeader,
  users: usersFromServer,
  categories: categoriesFromServer,
  goods: productsList,
  choosenUser: 'all',
  setChoosenUser: () => {},
  choosenCategories: ['all'],
  setChoosenCategories: () => {},
  query: '',
  setQuery: () => {},
  sortId: 'ID',
  setSortId: () => {},
  sortCount: 0,
  setSortCount: () => {},
});

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [visibleGoods, setVisibleGoods] = useState<Good[]>(productsList);
  const [choosenUser, setChoosenUser] = useState('all');
  const [choosenCategories, setChoosenCategories] = useState<string[]>(['all']);
  const [query, setQuery] = useState('');
  const [sortId, setSortId] = useState('ID');
  const [sortCount, setSortCount] = useState(0);

  function filterByQuery(currentGoods: Good[]) {
    return currentGoods
      .filter(good => (
        good.name.toLowerCase().includes(query.toLowerCase())));
  }

  function filterByUser(currentGoods: Good[]) {
    return currentGoods
      .filter(good => good.owner?.name === choosenUser);
  }

  function filterByCategory(currentGoods: Good[]) {
    return currentGoods
      .filter(good => (good.categorie?.title
        && choosenCategories.includes(good.categorie.title)));
  }

  function sortGoods() {
    if (sortId === 'ID') {
      const newGoods = [...visibleGoods].sort((paramA: Good, paramB: Good) => {
        return (sortCount === 0 || sortCount === 1)
          ? paramA.id - paramB.id
          : paramB.id - paramA.id;
      });

      setVisibleGoods(() => newGoods);
    }

    if (sortId === 'Product') {
      const newGoods = [...visibleGoods].sort((paramA: Good, paramB: Good) => {
        return (sortCount === 0 || sortCount === 1)
          ? paramA.name.localeCompare(paramB.name)
          : paramB.name.localeCompare(paramA.name);
      });

      setVisibleGoods(() => newGoods);
    }

    if (sortId === 'Category') {
      const newGoods = [...visibleGoods].sort((paramA: Good, paramB: Good) => {
        if (paramA.categorie?.title && paramB.categorie?.title) {
          return (sortCount === 0 || sortCount === 1)
            ? paramA.categorie?.title.localeCompare(paramB.categorie?.title)
            : paramB.categorie?.title.localeCompare(paramA.categorie?.title);
        }

        return 0;
      });

      setVisibleGoods(() => newGoods);
    }

    if (sortId === 'User') {
      const newGoods = [...visibleGoods].sort((paramA: Good, paramB: Good) => {
        if (paramA.owner?.name && paramB.owner?.name) {
          return (sortCount === 0 || sortCount === 1)
            ? paramA.owner?.name.localeCompare(paramB.owner?.name)
            : paramB.owner?.name.localeCompare(paramA.owner?.name);
        }

        return 0;
      });

      setVisibleGoods(() => newGoods);
    }
  }

  const filterBy = () => {
    let currentGoods: Good[];

    if (choosenUser === 'all') {
      if (choosenCategories[0] === 'all') {
        currentGoods = productsList;

        if (query !== '') {
          currentGoods = filterByQuery(currentGoods);
        }
      } else {
        currentGoods = filterByCategory(productsList);

        if (query !== '') {
          currentGoods = filterByQuery(currentGoods);
        }
      }

      setVisibleGoods(currentGoods);
    } else if (choosenUser !== 'all') {
      if (choosenCategories[0] === 'all') {
        currentGoods = filterByUser(productsList);

        if (query !== '') {
          currentGoods = filterByQuery(currentGoods);
        }
      } else {
        currentGoods = filterByUser(filterByCategory(productsList));

        if (query !== '') {
          currentGoods = filterByQuery(currentGoods);
        }
      }

      setVisibleGoods(currentGoods);
    }
  };

  useEffect(filterBy,
    [
      choosenUser,
      choosenCategories,
      query,
    ]);

  useEffect(() => {
    sortGoods();
  },
  [
    sortId,
    sortCount,
  ]);

  const contextValue = {
    table: tableHeader,
    users: usersFromServer,
    categories: categoriesFromServer,
    goods: visibleGoods,
    choosenUser,
    setChoosenUser,
    choosenCategories,
    setChoosenCategories,
    query,
    setQuery,
    sortId,
    setSortId,
    sortCount,
    setSortCount,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
