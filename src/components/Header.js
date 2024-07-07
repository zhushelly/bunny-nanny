import React from 'react';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';

const Header = ({ user }) => {
  return (
    <header>
      <div>
        {user ? (
          <>
            <span>User ID: {user?.uid}</span>
            <button onClick={() => auth.signOut()}>Logout</button>
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
