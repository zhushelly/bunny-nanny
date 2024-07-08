import React from 'react';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header>
      <div>
        {user ? (
          <>
            <span>User ID: {user?.uid}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
      <div>
        <h1>Need a nanny? Find</h1>
      </div>
      <div>
        <a href="/register">
          <img src="link-to-register-icon.png" alt="Register a Bunny" />
        </a>
      </div>
    </header>
  );
};

export default Header;
