"use client";

import db from "@/firebase";
import { useUser, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { collection, doc, getDocs } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;

      const colRef = collection(doc(collection(db, "users"), user.id), search);
      const docs = await getDocs(colRef);
      const flashcards = [];
      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });
      // Sort flashcards by priority (high to low)
      flashcards.sort((a, b) => a.priority - b.priority);
      setFlashcards(flashcards);
    }

    getFlashcard();
  }, [search, user]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getPriorityColor = (priority) => {
    const colors = {
      1: "red",
      2: "orange",
      3: "yellow",
      4: "green",
      5: "blue",
    };
    return colors[priority] || "white"; // default white
  };

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

      <Container sx={{ bgcolor: "black" }}>
        <Box>
          <Typography
            variant={"h2"}
            align={"left"}
            textTransform={"capitalize"}
            my={3}
            sx={{ color: "white", fontWeight: "bold", fontStyle: "Inter" }}
          >
            {search} Tasks.
          </Typography>
        </Box>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {flashcards.map((flashcard) => (
            <Grid item xs={8} sm={6} md={4} key={flashcard.id}>
              <Card
                sx={{
                  bgcolor: flipped[flashcard.id]
                    ? "black"
                    : getPriorityColor(flashcard.priority), // color by priority, black when flipped to change shape
                }}
              >
                <CardActionArea
                  onClick={() => handleCardClick(flashcard.id)}
                  onMouseEnter={() => setHoveredCard(flashcard.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardContent>
                    <Box
                      sx={{
                        perspective: "1000px",
                        "& > div": {
                          transition: "transform 0.6s",
                          transformStyle: "preserve-3d",
                          position: "relative",
                          height: "372px",
                          width: "100%",
                          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                          transform: flipped[flashcard.id]
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                          borderRadius: 2,
                        },
                        "& > div > div": {
                          position: "absolute",
                          height: "100%",
                          width: "100%",
                          backfaceVisibility: "hidden",
                          display: "flex",
                          justifyContent: "left",
                          alignItems: "top",
                          boxSizing: "border-box",
                          borderRadius: 2,
                          padding: 2,
                          bgcolor: "white",
                        },
                        "& > div > div:nth-of-type(2)": {
                          transform: "rotateY(180deg)",
                        },
                      }}
                    >
                      <Box>
                        <div>
                          {hoveredCard === flashcard.id ? (
                            <Typography
                              variant="body2"
                              sx={{
                                color: "black",
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                                fontStyle: "Inter",
                              }}
                            >
                              {flashcard.description}
                            </Typography>
                          ) : (
                            <Typography
                              variant="h6"
                              sx={{
                                color: "black",
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                                fontStyle: "Inter",
                              }}
                            >
                              {flashcard.title}.
                            </Typography>
                          )}
                        </div>
                        <div>
                          <Typography
                            variant="body1"
                            sx={{
                              color: "black",
                              fontSize: "1.5rem",
                              fontWeight: "bold",
                              fontStyle: "Inter",
                            }}
                          >
                            {flashcard.tagline}.
                          </Typography>
                        </div>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
