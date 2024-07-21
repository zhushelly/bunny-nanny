import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { auth } from '../firebase'; // Ensure you import auth from your firebase configuration
import './styles/SearchResult.css';
import Header from './Header'; // Ensure you import the Header component

const SearchResult = () => {
  const location = useLocation();
  const { nannies } = location.state || { nannies: [] };
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  console.log('Nannies:', nannies);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header user={user} />
      <main>
        <div className="container">
          <div className="search-filters">
            <h2>Search Results</h2>
          </div>
          <div className="sitters-list">
            {nannies.length === 0 ? (
              <p>No nannies found</p>
            ) : (
              nannies.map((nanny, index) => (
                <div key={index} className="sitter">
                  {/*<img src={nanny.profilePhoto} alt={nanny.nannyName} className="sitter-image" />*/}
                  <div className="sitter-details">
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
      </main>
    </div>
  );
};

export default SearchResult;
