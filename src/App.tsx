import React, { useContext } from 'react';
import './App.scss';
import { AppContext } from './Components/AppProvider';
import { Navigation } from './Components/Navigation';
import { ProductTable } from './Components/ProductTable';

export const App: React.FC = () => {
  const { goods } = useContext(AppContext);
  const isNoGoods: boolean = goods.length === 0;

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <Navigation />
        </div>

        <div className="box table-container">
          {isNoGoods && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {!isNoGoods && <ProductTable />}
        </div>
      </div>
    </div>
  );
};
