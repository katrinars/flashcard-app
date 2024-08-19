"use client";

import React from "react";
import {
  AppBar,
  Box,
  Typography,
  Grid,
  Button,
  Container,
  Toolbar,
} from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import getStripe from "@/utils/get-stripe";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();

  const handleSubmit = async (plan) => {
    console.log(`Submitting plan: ${plan}`);
    try {
      const checkoutSession = await fetch("../api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (!checkoutSession.ok) {
        const errorData = await checkoutSession.json();
        throw new Error(
          `HTTP error! status: ${checkoutSession.status}, message: ${
            errorData.error?.message || "Unknown error"
          }`
        );
      }

      const checkoutSessionJson = await checkoutSession.json();
      console.log("Checkout session created:", checkoutSessionJson);

      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });

      if (error) {
        console.error("Stripe redirect error:", error.message);
        throw error;
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  const plans = [
    { name: "Free", price: "$0", description: "Basic features" },
    {
      name: "Student",
      price: "$2.99/month",
      description: "Create up to 3 flashcard decks per month",
      buttonText: "CHOOSE STUDENT",
    },
    {
      name: "Pro",
      price: "$9.99/month",
      description: "Create up to 20 flashcard decks per month",
      buttonText: "CHOOSE PRO",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "black",
        minHeight: "100vh",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // justifyContent: "center",
        padding: 4,
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
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <SignedOut>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                    },
                    mr: 1,
                    fontFamily: "Helvetica, Arial, sans-serif",
                  }}
                  onClick={() => router.push("/sign-in")}
                >
                  Sign in
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#333333",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#4d4d4d",
                    },
                    fontFamily: "Helvetica, Arial, sans-serif",
                  }}
                  onClick={() => router.push("/sign-up")}
                >
                  Register
                </Button>
              </SignedOut>
              <SignedIn>
                <Button color="inherit" href="/generate">
                  Add Project
                </Button>
                <Button color="inherit" href="/flashcards">
                  Projects
                </Button>
                <Button color="inherit" href="/pricing">
                  Pricing
                </Button>
                <UserButton />
              </SignedIn>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Typography variant="h2" component="h1" sx={{ mb: 6, color: "white" }}>
        Pricing Plans
      </Typography>

      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{ maxWidth: 1200 }}
      >
        {plans.map((plan) => (
          <Grid item xs={12} sm={4} key={plan.name}>
            <Box
              sx={{
                backgroundColor: "#333",
                borderRadius: 2,
                height: 250,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 3,
              }}
            >
              <div>
                <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                  {plan.name}.
                </Typography>
                <Typography variant="h5" sx={{ color: "white", mb: 1 }}>
                  {plan.price}
                </Typography>
                <Typography variant="body2" sx={{ color: "#aaa" }}>
                  {plan.description}
                </Typography>
              </div>
              {plan.name !== "Free" && (
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: "#1976d2",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                  }}
                  onClick={() => handleSubmit(plan.name)}
                >
                  {plan.buttonText}
                </Button>
              )}
              <Box sx={{ alignSelf: "flex-end", color: "#aaa" }}>
                <AutorenewIcon />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
