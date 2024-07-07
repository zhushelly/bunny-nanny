import React from 'react';

const Filter = () => {
  return (
    <div className="filter">
      <h2>Filter</h2>
      <div>
        <label>Location</label>
        <input type="text" placeholder="Enter location" />
      </div>
      <div>
        <label>Pricing</label>
        <input type="text" placeholder="Enter pricing" />
      </div>
    </div>
  );
};

export default Filter;
