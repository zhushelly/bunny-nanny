import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import Header from './Header';
import './styles/Home.css';
import axios from 'axios';
import { useLoadScript, StandaloneSearchBox } from '@react-google-maps/api';

const libraries = ['places'];
const googleMapsApiKey = REACT_APP_GOOGLE_MAPS_API_KEY; // Replace with your Google Maps API key

const Home = () => {
  const [user, setUser] = useState(null);
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

    console.log('Form data to be sent:', formData);

    try {
      const response = await axios.get('http://localhost:3001/api/nannies', {
        params: {
          lat: formData.lat,
          lng: formData.lng,
          radius: 20,
        },
      });

      const nannies = response.data;
      console.log('Nannies found:', nannies);

      navigate('/search-results', { state: { nannies } });
    } catch (error) {
      console.error('Error fetching nannies:', error);
      alert('There was an error fetching nannies.');
    }
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });

  return (
    <div>
      <Header user={user} />
      <main>
        {user ? (
          <Navigate to="/user-home" />
        ) : (
          <div className="home-container">
            <section className="hero-section">
              <h1>Being away? Find care for your bunny in your neighborhood!</h1>
              <p>Book with trusted sitters.</p>

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
        )}
      </main>
    </div>
  );
};

export default Home;
