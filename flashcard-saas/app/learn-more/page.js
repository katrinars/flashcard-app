"use client";

import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function LearnMore() {
  const router = useRouter();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Discover Cards Against Confusion: Your AI-Powered Study Companion
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          Create, organize, and master your study materials with the power of AI
        </Typography>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h3" gutterBottom>
          Why Choose Cards Against Confusion?
        </Typography>
        <Typography variant="body1" paragraph>
          Cards Against Confusion is your intelligent study partner, leveraging
          AI to transform how you create and interact with flashcards. Whether
          you're preparing for exams, learning a new language, or expanding your
          knowledge, Cards Against Confusion offers an intuitive and efficient
          way to enhance your learning experience.
        </Typography>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h3" gutterBottom>
          Key Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              AI-Powered Flashcard Creation
            </Typography>
            <Typography variant="body1">
              Simply input your study material, and watch as our AI generates
              comprehensive, tailored flashcards in seconds.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Smart Organization
            </Typography>
            <Typography variant="body1">
              Our AI categorizes and tags your flashcards, making it easy to
              find and review related concepts.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Adaptive Learning
            </Typography>
            <Typography variant="body1">
              Cards Against Confusion learns from your study patterns, focusing
              on areas where you need more practice.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h3" gutterBottom>
          Benefits of Using Cards Against Confusion
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Save Time, Learn More
            </Typography>
            <Typography variant="body1">
              Spend less time creating study materials and more time actually
              learning. Our AI does the heavy lifting for you.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Personalized Learning Experience
            </Typography>
            <Typography variant="body1">
              Cards Against Confusion adapts to your learning style and pace,
              providing a truly personalized study experience.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Accessible Anywhere
            </Typography>
            <Typography variant="body1">
              Study on any device, at any time. Your flashcards are always at
              your fingertips.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: "center" }}>
        <Typography variant="h4" component="h3" gutterBottom>
          Ready to Revolutionize Your Study Routine?
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => router.push("/")}
          sx={{ mt: 2 }}
        >
          Get Started with Cards Against Confusion
        </Button>
      </Box>
    </Container>
  );
}
