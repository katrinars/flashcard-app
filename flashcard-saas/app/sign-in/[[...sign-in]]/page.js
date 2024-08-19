import { SignIn, SignedIn, SignedOut, useUser, UserButton } from "@clerk/nextjs";
import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import Link from "next/link";
import React from "react";

export default function SignUpPage() {
  return (
    <Box
    sx={{
      minHeight: "100vh",
      backgroundColor: "#000000",
      color: "white",
      display: "flex",
      flexDirection: "column",
      fontFamily: "Helvetica, Arial, sans-serif",
    }}
  >
  <AppBar
    position="static"
    sx={{
      backgroundColor: "transparent",
      boxShadow: "none",
      marginBottom: 18,
    }}
  >
    <Container>
      <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: "bold",
            fontFamily: "Helvetica, Arial, sans-serif",
            lineHeight: 1.25,
            fontSize: "0.9rem",
          }}
        >
          <Link
            href="/"
            passHref
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Cards
            <br />
            Against
            <br />
            Confusion
          </Link>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          
            <Button
              variant="contained"
              href="/sign-in"
              sx={{
                backgroundColor: "white",
                color: "black",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
                mr: 1,
                fontFamily: "Helvetica, Arial, sans-serif",
              }}
            >
              Sign in
            </Button>
            <Button
              variant="contained"
              href="/sign-up"
              sx={{
                backgroundColor: "#333333",
                color: "white",
                "&:hover": {
                  backgroundColor: "#4d4d4d",
                },
                fontFamily: "Helvetica, Arial, sans-serif",
              }}
            >
              Sign Up
            </Button>
          
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
  <Box>
          <Typography variant={'h2'} align={'center'}
                      textTransform={'capitalize'} my={3} sx={{ color: "white",fontWeight: 'bold', fontStyle: 'Inter', }}>
            Sign In.
          </Typography>
        </Box> 
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ textAlign: "center", my: 4 }}
      >
        <SignIn />
      </Box>
    </Box>
  );
}
