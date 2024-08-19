"use client";
import {
  Box,
  Button,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

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
            <Box>
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
                <UserButton />
              </SignedIn>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container
        maxWidth="md"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{
            color: "white",
            fontWeight: "bold",
            fontSize: { xs: "3rem", sm: "4rem", md: "5rem" },
            lineHeight: 1.2,
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          Cards
          <br />
          Against
          <br />
          Confusion
        </Typography>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            marginTop: 2,
            marginBottom: 4,
            maxWidth: "600px",
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          A task app for the chronically overwhelmed.
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginBottom: 12,
          }}
        >
          <Button
            component={Link}
            href="/generate"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "#333333",
              color: "white",
              "&:hover": {
                backgroundColor: "#4d4d4d",
              },
              px: 4,
            }}
          >
            Get Started
          </Button>
        </Box>

        <Typography
          variant="h2"
          component="h2"
          gutterBottom
          sx={{
            color: "white",
            fontWeight: "bold",
            marginBottom: 6,
            textAlign: "center",
          }}
        >
          Features
        </Typography>
        <Grid container spacing={3} sx={{ marginBottom: 12 }}>
          {[
            {
              title: "Easy Text Input",
              description:
                "Simply input your text and let our software do the rest. Creating flashcards cannot be easier.",
            },
            {
              title: "Smart Flashcards",
              description:
                "Our AI intelligently breaks down your text into concise flashcards, perfect for studying.",
            },
            {
              title: "Accessible Anywhere",
              description:
                "Access your flashcards from any device, at any time. Study on the go with ease.",
            },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  backgroundColor: "transparent",
                  color: "white",
                  border: "1px solid #333",
                  boxShadow: "none",
                }}
              >
                <CardContent>
                  <Box sx={{ textAlign: "center", marginBottom: 2 }}>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ marginBottom: 1 }}
                    >
                      {index + 1}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{ textAlign: "center" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: "center" }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", marginTop: 12, marginBottom: 12 }}>
          <Typography
            variant="h3"
            component="h3"
            gutterBottom
            sx={{
              color: "white",
              fontWeight: "bold",
              marginBottom: 2,
            }}
          >
            Why Choose Cards Against Confusion?
          </Typography>
          <Typography
            variant="body1"
            sx={{ maxWidth: "800px", margin: "0 auto" }}
          >
            Cards Against Confusion is your intelligent study partner,
            leveraging AI to transform how you create and interact with
            flashcards. Whether you're preparing for exams, learning a new
            language, or expanding your knowledge, Cards Against Confusion
            offers an intuitive and efficient way to enhance your learning
            experience.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
