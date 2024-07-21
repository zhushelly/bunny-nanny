import React from 'react';
import { useLocation } from 'react-router-dom';
import './styles/SearchResult.css';

const SearchResult = () => {
  const location = useLocation();
  const { nannies } = location.state || { nannies: [] };
  console.log('Nannies:', nannies);

  return (
    <div className="container">
      <div className="search-filters">
        <h2>Search Results</h2>
      </div>
      <div className="nannies-list">
        {nannies.length === 0 ? (
          <p>No nannies found</p>
        ) : (
          nannies.map((nanny, index) => (
            <div key={index} className="nanny">
{/* <img src={nanny.profilePhoto} alt={nanny.nannyName} className="nanny-image" /> */}              <div className="nanny-details">
                <h3>{nanny.nannyName}</h3>
                <p>{nanny.location.latitude}, {nanny.location.longitude}</p>
                <p>{nanny.petCareExperience}</p>
                <p>{nanny.headline}</p>
                <p>{nanny.mobilePhoneNumber}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchResult;
