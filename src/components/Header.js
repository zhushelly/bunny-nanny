import React from 'react';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Header.css'; 

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
    <header className="header">

      <div className="header-left">
        <a href="/register">
            <p>Become a nanny</p>
        </a>
      </div>
      <div className="header-right">
        {user ? (
          <>
            <span>User ID: {user?.uid}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <span className="login-signup">
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;