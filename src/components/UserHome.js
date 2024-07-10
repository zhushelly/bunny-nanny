import React, { useEffect, useState, useRef } from 'react';
import { auth, db, serverTimestamp } from '../firebase';
import Header from './Header';
import './styles/Home.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { useLoadScript, StandaloneSearchBox } from '@react-google-maps/api';

const libraries = ['places'];
const googleMapsApiKey = 'AIzaSyAtLs_X-NwhA_vTacF-oaf0DQM_RiPRirE'; // Replace with your Google Maps API key

const UserHome = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    whenAway: '',
    location: '',
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

    console.log('Form data to be sent:', formData);

    try {
      const docRef = await addDoc(collection(db, 'bookings'), {
        ...formData,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      console.log('Document written with ID: ', docRef.id);
      alert('Booking request submitted successfully!');
      navigate('/search-results');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('There was an error submitting your request.');
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
                          setFormData({ ...formData, location: places[0].formatted_address });
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
