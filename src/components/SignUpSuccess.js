import React from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "@mui/material";

const SignUpSuccess = () => {
  return (
    <Container>
      <h2>You have successfully signed up</h2>
      <h2>Return to Login</h2>

      <Button variant="contained" color="secondary" component={Link} to="/login">
        Login
      </Button>

    </Container>
  );
};

export default SignUpSuccess;
