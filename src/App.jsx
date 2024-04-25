/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import classNames from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const getUserById = userId => {
  const foundUser = usersFromServer.find(user => user.id === userId);

  return foundUser || null;
};

const getCategoryById = categoryId => {
  const foundCategory = categoriesFromServer.find(
    category => category.id === categoryId,
  );

  return foundCategory || null;
};

const products = productsFromServer.map(product => {
  const category = getCategoryById(product.categoryId);
  const user = category ? getUserById(category.ownerId) : null;

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [filteredByOwner, setFilteredByOwner] = useState(0);
  const [query, setQuery] = useState('');
  const [filteredByCategory, setFilteredByCategory] = useState([]);

  const filterByOwner = userId => setFilteredByOwner(userId);

  const visibleProduct = products.filter(product => {
    let isFilterSelected = true;

    if (filteredByOwner) {
      isFilterSelected = product.user.id === filteredByOwner;
    }

    if (query) {
      isFilterSelected = product.name
        .toLowerCase()
        .includes(query.toLowerCase());
    }

    if (filteredByCategory.length) {
      isFilterSelected = filteredByCategory.includes(product.categoryId);
    }

    return isFilterSelected;
  });

  const handleInput = event => setQuery(event.target.value);

  const handleReset = () => {
    setQuery('');
    setFilteredByOwner(0);
    setFilteredByCategory([]);
  };

  const handleFilterByCategory = categoriesId => {
    setFilteredByCategory(previousCategories => {
      if (previousCategories.includes(categoriesId)) {
        return previousCategories.filter(
          categoryId => categoriesId !== categoryId,
        );
      }

      return [...previousCategories, categoriesId];
    });
  };

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
                href="#/"
                className={classNames({ 'is-active': !filteredByOwner })}
                onClick={() => filterByOwner(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  onClick={() => filterByOwner(user.id)}
                  className={classNames({
                    'is-active': user.id === filteredByOwner,
                  })}
                >
                  {user.name}
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
                  onChange={handleInput}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={() => setQuery('')}
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => setFilteredByCategory([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={classNames('button mr-2 my-1', {
                    'is-info': filteredByCategory.includes(category.id),
                  })}
                  href="#/"
                  onClick={() => handleFilterByCategory(category.id)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleReset}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!visibleProduct.length && (
            <p data-cy="NoMatchingMessage">No result</p>
          )}
          {visibleProduct.length > 0 && (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProduct.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {`${product.category.icon} - ${product.category.title}`}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={
                        product.user.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
