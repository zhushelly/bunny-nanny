import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import UserHome from "./components/UserHome";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import SignUpSuccess from "./components/SignUpSuccess";
import SearchResult from "./components/SearchResult";
import NannyForm from "./components/NannyForm";
import { auth } from "./firebase"; // Make sure this is the correct path to your firebase configuration

const PrivateRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = auth.currentUser !== null;
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup-success" element={<SignUpSuccess />} />
          <Route path="/user-home" element={<PrivateRoute element={UserHome} />} />
          <Route path="/search-results" element={<SearchResult />} />
          <Route path="/become-a-nanny" element={<NannyForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
