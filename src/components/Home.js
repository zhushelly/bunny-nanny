import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import Header from './Header';
import './styles/Home.css';

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        navigate('/user-home');
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [navigate]);


  return (
    <div>
      <Header user={user} />
      <main>
        {user ? (
          <Navigate to="/user-home" />
        ) : (
          <div className="home-container">
            <section className="hero-section">
              <h1>Loving pet care in your neighborhood!</h1>
              <p>Book trusted bunny sitters.</p>
              <div className="search-form">
                <form>

                  <div className="form-group">
                    <label htmlFor="when-away">For When You're Away:</label>
                    <select id="when-away">
                      <option value="boarding">Boarding</option>
                      <option value="drop-in-visits">Drop-In Visits</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="location">Your location: </label>
                    <input type="text" id="location" name="location" placeholder="Zip code or Address" />
                  </div>

    
                  <div className="form-group">
                    <label htmlFor="drop-off">For these days:</label>
                    <input type="date" id="drop-off" name="drop-off" />
                    <input type="date" id="pick-up" name="pick-up" />
                  </div>
                  <button type="submit">Search</button>
                </form>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
