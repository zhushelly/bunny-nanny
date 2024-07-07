import React from "react";
import { Link } from "react-router-dom";
import { Button, Container } from "@mui/material";

const Home = () => {
    return (
    <Container>
        <h2>Welcome to Bunny Nanny</h2>
        <Button variant="contained" color="primary" component={Link} to="/login">
        Login
        </Button>

        <Button variant="contained" color="secondary" component={Link} to="/signup">
        Sign Up
        </Button>
    </Container>
    );
};

export default Home;