import React, { useEffect, useState, useRef } from 'react';
import { auth } from '../firebase';
import Header from './Header';
import './styles/Home.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { useLoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import axios from 'axios';

const libraries = ['places'];
const googleMapsApiKey = 'AIzaSyAtLs_X-NwhA_vTacF-oaf0DQM_RiPRirE'; // Replace with your Google Maps API key

const UserHome = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    whenAway: '',
    location: '',
    lat: null,
    lng: null,
    dropOff: '',
    pickUp: '',
  });

  const searchBoxRef = useRef(null);
  const navigate = useNavigate();

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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.location || !formData.dropOff || !formData.pickUp) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3001/api/nannies', {
        params: {
          lat: formData.lat,
          lng: formData.lng,
          radius: 20, // Example radius in miles
        },
      });

      console.log('Response from backend:', response.data);

      // Navigate to search results with the response data
      navigate('/search-results', { state: { nannies: response.data } });
    } catch (error) {
      console.error('Error fetching nannies:', error);
      alert('There was an error fetching nannies.');
    }
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Header user={user} />
      <main>
        <div className="home-container">
          <section className="hero-section">
            <h1>Loving pet care in your neighborhood!</h1>
            <p>Book trusted bunny sitters.</p>

            <div className="search-form">
              {isLoaded ? (
                <form onSubmit={handleSubmit}>

                  <div className="form-group">
                    <label htmlFor="service-type">Service type:</label>
                    <select id="service-type" value={formData.whenAway} onChange={handleInputChange}>
                      <option value="boarding">Boarding</option>
                      <option value="drop-in-visits">Drop-In Visits</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="location">Your location: </label>
                    <StandaloneSearchBox
                      onLoad={(ref) => {
                        searchBoxRef.current = ref;
                      }}
                      onPlacesChanged={() => {
                        const places = searchBoxRef.current.getPlaces();
                        if (places.length > 0) {
                          const place = places[0];
                          setFormData({
                            ...formData,
                            location: place.formatted_address,
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                          });
                        }
                      }}
                    >
                      <input
                        type="text"
                        id="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Zip code or Address"
                      />
                    </StandaloneSearchBox>
                  </div>

                  <div className="form-group">
                    <label htmlFor="dropOff">For these days:</label>
                    <input
                      type="date"
                      id="dropOff"
                      value={formData.dropOff}
                      onChange={handleInputChange}
                    />
                    <input
                      type="date"
                      id="pickUp"
                      value={formData.pickUp}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <button type="submit">Search</button>
                </form>
              ) : (
                <div>Loading map...</div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserHome;
