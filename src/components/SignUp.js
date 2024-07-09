import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { TextField, Button, Container } from "@mui/material";
import Header from "./Header";


const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/signup-success");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div>
        <Header />
    <Container>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <TextField
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">Sign Up</Button>
      </form>
    </Container>
    </div>
  );
};

export default SignUp;
