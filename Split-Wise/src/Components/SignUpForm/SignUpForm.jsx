import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, collection, addDoc, getDoc, doc, query, where, getDocs, setDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { auth } from "../../Firebase/Firebase";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpForm() {
  const db = getFirestore(app)
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formState = {
      userName: data.get("userName"),
      email: data.get("email"),
      password: data.get("password"),
    };
    setSubmitButtonDisabled(true);
    createUserWithEmailAndPassword(auth, formState.email, formState.password)
      .then(async (response) => {
        setSubmitButtonDisabled(false);
        const user = response.user;
        await updateProfile(user, {
          displayName: formState.userName,
        });
        const userRef = db.collection("userdata").doc(user.uid);
        await userRef.set({
          userName: formState.userName,
          email: formState.email,
        });
        navigate(`/${user.uid}`);
      })
      .catch((error) => {
        setSubmitButtonDisabled(false);
        setError(error.message);
      });
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ m: 5 }}>
          Let's Get Started
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="userName"
              id="userName"
              label="User Name"
              required
              fullWidth
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="email"
              id="email"
              label="Email Address"
              type="email"
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="password"
              id="password"
              type="password"
              label="Password"
              required
              fullWidth
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          disabled={submitButtonDisabled}
          sx={{ mt: 3, mb: 2 }}
          fullWidth
        >
          Sign Up
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
              <Typography 
              component={Link}
              to="/SignIn"
              sx={{ color: "#333"}}
              >
                Already have an account? Sign In
              </Typography>
          </Grid>
        </Grid>
      </Box>
      <Typography
        color="error"
        fontWeight="bold"
        variant="body1"
        sx={{ textAlign: "center" }}
      >
        {error}
      </Typography>
    </Container>
  );
}