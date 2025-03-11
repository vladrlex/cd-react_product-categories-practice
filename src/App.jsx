/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import cn from 'classnames';

import './App.scss';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function getCategory(categoryId) {
  return (
    categoriesFromServer.find(category => categoryId === category.id) || null
  );
}

function getUserById(ownerId) {
  return usersFromServer.find(user => ownerId === user.id) || null;
}

const products = productsFromServer.map(product => {
  const category = getCategory(product.categoryId);
  const user = getUserById(category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const DEFAULT_VALUE = 'all';
  const VALUE_TOPICS = ['ID', 'Product', 'Category', 'User'];

  const getVisibleProduct = (
    productsList,
    { selected, nameFilter, selectedCategory },
  ) => {
    let filteredProduct = [...productsList];

    if (selected !== DEFAULT_VALUE) {
      filteredProduct = filteredProduct.filter(
        product => product.user && product.user.name === selected,
      );
    }

    if (nameFilter.trim()) {
      const normalizedNameFilter = nameFilter.toLowerCase().trim();

      filteredProduct = filteredProduct.filter(product => {
        return product.name.toLowerCase().includes(normalizedNameFilter);
      });
    }

    if (selectedCategory !== DEFAULT_VALUE) {
      filteredProduct = filteredProduct.filter(
        product => product.category.title === selectedCategory,
      );
    }

    return filteredProduct;
  };

  const [selected, setSelected] = useState(DEFAULT_VALUE);
  const [nameFilter, setNameFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_VALUE);

  const visibleProduct = getVisibleProduct(products, {
    selected,
    nameFilter,
    selectedCategory,
  });

  const handleResetFilters = event => {
    event.preventDefault();
    setNameFilter('');
    setSelected(DEFAULT_VALUE);
    setSelectedCategory(DEFAULT_VALUE);
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
                onClick={() => setSelected(DEFAULT_VALUE)}
                className={selected === DEFAULT_VALUE ? 'is-active' : ''}
              >
                All
              </a>
              {usersFromServer.map(person => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={person.id}
                  className={selected === person.name ? 'is-active' : ''}
                  onClick={e => {
                    e.preventDefault();
                    setSelected(person.name);
                  }}
                >
                  {person.name}
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
                  value={nameFilter}
                  onChange={event => setNameFilter(event.target.value)}
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {nameFilter.length !== 0 && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setNameFilter('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button is-success mr-6', {
                  'is-outlined': selectedCategory !== DEFAULT_VALUE,
                })}
                onClick={() => setSelectedCategory(DEFAULT_VALUE)}
              >
                All
              </a>
              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={cn('button mr-2 my-1', {
                    'is-info': selectedCategory === category.title,
                  })}
                  href="#/"
                  onClick={() =>
                    category.title && setSelectedCategory(category.title)
                  }
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
                onClick={handleResetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProduct.length > 0 ? (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  {VALUE_TOPICS.map(topic => (
                    <th key={topic}>
                      <span className="is-flex is-flex-wrap-nowrap">
                        {topic}
                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleProduct.map(product => {
                  return (
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
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
