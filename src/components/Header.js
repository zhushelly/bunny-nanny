import React from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
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

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <header className="header">
      <div className="header-left">
          <p className = "nanny" onClick={() => handleNavigate('/become-a-nanny')}>Become a Nanny</p>
      </div>
      <div className="header-right">
        {user ? (
          <>
            <span class = "user-id">User ID: {user?.uid}</span>
            <span class = "logout-button"><button onClick={handleLogout}>Logout</button></span>
          </>
        ) : (
          <span className="login-signup">
            <>
              <p className="login" onClick={() => handleNavigate('/login')}>Login</p>
              <p className="signup" onClick={() => handleNavigate('/signup')}>Sign Up</p>
            </>
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;
