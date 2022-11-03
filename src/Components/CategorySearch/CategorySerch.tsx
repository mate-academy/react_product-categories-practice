import { FC, useContext } from 'react';
import classNames from 'classnames';
import { AppContext } from '../AppProvider';

export const CategorySerch: FC = () => {
  const {
    categories,
    choosenCategories,
    setChoosenCategories,
  } = useContext(AppContext);

  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      setChoosenCategories(['all']);
    } else if (choosenCategories[0] === 'all') {
      setChoosenCategories([category]);
    } else if (choosenCategories.includes(category)) {
      let newList = choosenCategories
        .filter((good: string) => good !== category);

      if (newList.length === 0) {
        newList = ['all'];
      }

      setChoosenCategories(newList);
    } else {
      const newList = [...choosenCategories, category];

      setChoosenCategories(newList);
    }
  };

  return (
    <div className="panel-block is-flex-wrap-wrap">
      <a
        href="#/"
        data-cy="AllCategories"
        className={classNames(
          'button',
          'is-success',
          'mr-6',
          { 'is-outlined': choosenCategories[0] !== 'all' },
        )}
        onClick={() => handleCategoryChange('all')}
      >
        All
      </a>

      {categories.map(({ id, title }) => (
        <a
          data-cy="Category"
          className={classNames(
            'button',
            'mr-2',
            'my-1',
            { 'is-info': choosenCategories.includes(title) },
          )}
          href="#/"
          key={id}
          onClick={() => handleCategoryChange(title)}
        >
          {title}
        </a>
      ))}
    </div>
  );
};
