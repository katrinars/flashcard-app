"use client";

import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Flashcard SaaS
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <SignedIn>
              <Button
                component={Link}
                href="/projects"
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Projects
              </Button>
              <Button
                component={Link}
                href="/pricing"
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Pricing
              </Button>
            </SignedIn>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <SignedOut>
              <Button color="inherit" component={Link} href="/sign-in">
                Login
              </Button>
              <Button color="inherit" component={Link} href="/sign-up">
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
