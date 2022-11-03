import React, { ChangeEvent, useEffect, useState } from "react";
import "./App.scss";

import usersFromServer from "./api/users";
import productsFromServer from "./api/products";
import categoriesFromServer from "./api/categories";
import { Product } from "./Types";
import { ProductCard } from "./api/Components/ProductCard";
import classNames from "classnames";

const productList: Product[] = productsFromServer
  .map((product) => ({
    ...product,
    category: categoriesFromServer.find((cat) => cat.id === product.categoryId),
  }))
  .map((withCategory) => ({
    ...withCategory,
    user: usersFromServer.find(
      (user) => user.id === withCategory.category?.ownerId
    ),
  }));

export const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>(productList);
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("");

  const handleSelectedUser = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setSelectedUser(event.currentTarget.id);
  };

  const handleUserInput = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.toLowerCase());
  };

  const handleCategorySelect = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (selectedCategory.includes(event.currentTarget.id)) {
      setSelectedCategory(
        selectedCategory.filter((cat) => cat !== event.currentTarget.id)
      );
    } else {
      setSelectedCategory([...selectedCategory, event.currentTarget.id]);
    }
  };

  const handleSortSelect = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (sortBy === event.currentTarget.id) {
      setOrder("desc");
    } else {
      setSortBy(event.currentTarget.id);
      setOrder("");
    }
    if (order === "desc" && sortBy === event.currentTarget.id) {
      setOrder(""), setSortBy("");
    }
  };
  const resetFilters = () => {
    setSelectedCategory([]);
    setQuery("");
    setSelectedUser("all");
    setSortBy("");
    setOrder("");
  };

  useEffect(() => {
    const filteredProducts = productList
      .filter((product) => {
        if (selectedUser === "all") {
          return true;
        }

        return product.user?.id === Number(selectedUser);
      })
      .filter((product) => {
        if (!query) {
          return true;
        }
        return product.name.toLowerCase().includes(query);
      })
      .filter((product) => {
        if (!selectedCategory.length) {
          return true;
        }
        return selectedCategory.includes(product.category!.title);
      })
      .sort((prev, next) => {
        switch (sortBy) {
          case "product":
            return prev.name.localeCompare(next.name);
          case "category":
            return prev.category!.title.localeCompare(next.category!.title);
          case "user":
            return prev.user!.name.localeCompare(next.user!.name);
          case "id":
            return prev.id - next.id;
          default:
            return 0;
        }
      });

    const isProductsReverse = order
      ? filteredProducts.reverse()
      : filteredProducts;
    setProducts(isProductsReverse);
  }, [selectedUser, query, selectedCategory, sortBy, order]);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                onClick={() => setSelectedUser("all")}
                className={classNames({ "is-active": selectedUser === "all" })}
              >
                All
              </a>
              {usersFromServer.map(({ name, id }) => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={id}
                  id={String(id)}
                  onClick={handleSelectedUser}
                  className={classNames({
                    "is-active": id === Number(selectedUser),
                  })}
                >
                  {name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={handleUserInput}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery("")}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={classNames("button is-success mr-6 is-outlined")}
                onClick={() => setSelectedCategory([])}
              >
                All
              </a>
              {categoriesFromServer.map(({ title, id }) => (
                <a
                  data-cy="Category"
                  className={classNames("button mr-2 my-1", {
                    "is-info": selectedCategory.includes(title),
                  })}
                  key={id}
                  id={title}
                  onClick={handleCategorySelect}
                >
                  {title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!products.length && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {!!products.length && (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a onClick={handleSortSelect} id="id">
                        <span className="icon">
                          {sortBy !== "id" && (
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          )}
                          {sortBy === "id" && !order && (
                            <i
                              data-cy="SortIcon"
                              className="fas fa-sort-down"
                            />
                          )}
                          {sortBy === "id" && order && (
                            <i data-cy="SortIcon" className="fas fa-sort-up" />
                          )}
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a onClick={handleSortSelect} id="product">
                        <span className="icon">
                          {sortBy !== "product" && (
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          )}
                          {sortBy === "product" && !order && (
                            <i
                              data-cy="SortIcon"
                              className="fas fa-sort-down"
                            />
                          )}
                          {sortBy === "product" && order && (
                            <i data-cy="SortIcon" className="fas fa-sort-up" />
                          )}
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a onClick={handleSortSelect} id="category">
                        <span className="icon">
                          {sortBy !== "category" && (
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          )}
                          {sortBy === "category" && !order && (
                            <i
                              data-cy="SortIcon"
                              className="fas fa-sort-down"
                            />
                          )}
                          {sortBy === "category" && order && (
                            <i data-cy="SortIcon" className="fas fa-sort-up" />
                          )}
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a onClick={handleSortSelect} id="user">
                        <span className="icon">
                          {sortBy !== "user" && (
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          )}
                          {sortBy === "user" && !order && (
                            <i
                              data-cy="SortIcon"
                              className="fas fa-sort-down"
                            />
                          )}
                          {sortBy === "user" && order && (
                            <i data-cy="SortIcon" className="fas fa-sort-up" />
                          )}
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
