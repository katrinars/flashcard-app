"use client";

import { Box, Typography, Grid, Button } from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import getStripe from "@/utils/get-stripe";

export default function PricingPage() {
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
    { name: "Free.", price: "$0", description: "Basic features" },
    {
      name: "Students.",
      price: "$2.99/month",
      description: "Create up to 10 flashcard decks",
      buttonText: "CHOOSE STUDENT",
    },
    {
      name: "Pro.",
      price: "$9.99/month",
      description: "Unlimited flashcard decks",
      buttonText: "CHOOSE PRO",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "black",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 4,
      }}
    >
      <Typography variant="h2" component="h1" sx={{ mb: 6 }}>
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
                height: 300,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 2,
              }}
            >
              <div>
                <Typography variant="h5">{plan.name}</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {plan.price}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {plan.description}
                </Typography>
              </div>
              {(plan.name === "Students." || plan.name === "Pro.") && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => handleSubmit(plan.name.replace(".", ""))}
                >
                  {plan.buttonText}
                </Button>
              )}
              <Box sx={{ alignSelf: "flex-end" }}>
                <AutorenewIcon />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
