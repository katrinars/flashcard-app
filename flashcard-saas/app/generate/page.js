"use client";

import db from "@/firebase";
import ProgressBar from "@/utils/get-progress";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import Link from "next/link";
import {
  collection,
  doc,
  getDoc,
  writeBatch,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert(
        "We're good, but not that good. Type a sentence or two about what you need to plan."
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("./api/generate", {
        method: "POST",
        body: text,
      });
      const cards = await response.json();
      const sortedCards = cards.sort((a, b) => a.priority - b.priority);
      setFlashcards(sortedCards);
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      1: "red",
      2: "orange",
      3: "green",
      4: "blue",
      5: "purple",
    };
    return colors[priority] || "black"; // black as default
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!name) {
      alert("Please enter a name for your flashcard set.");
      return;
    }

    if (!user) {
      alert("You must be signed in to save flashcards.");
      return;
    }

    try {
      const batch = writeBatch(db);
      const userDocRef = doc(db, "users", user.id);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, { flashcards: [] });
      }

      const userDoc = userDocSnap.data();
      const existingCollections = userDoc?.flashcards || [];

      if (existingCollections.find((f) => f.name === name)) {
        alert("Name already exists. Choose a different one.");
        return;
      }

      // Update user document with new flashcard set
      const updatedCollections = [...existingCollections, { name }];
      batch.update(userDocRef, { flashcards: updatedCollections });

      // Create a new collection for this flashcard set
      const flashcardSetRef = collection(
        db,
        `users/${user.id}/flashcardSets/${name}/cards`
      );

      flashcards.forEach((flashcard) => {
        const newCardRef = doc(flashcardSetRef);
        batch.set(newCardRef, {
          ...flashcard,
          priority: flashcard.priority || 3,
        });
      });

      await batch.commit();
      handleClose();
      router.push("/flashcards");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    }
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

      <Container
        maxWidth={false}
        disableGutters
        sx={{
          backgroundColor: "black",
          minHeight: "100vh",
          color: "white",
          padding: 0,
          margin: 0,
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <Box
          sx={{
            pt: 4,
            px: 2,
          }}
        >
          <Box>
            <Typography
              variant={"h2"}
              align={"center"}
              textTransform={"capitalize"}
              my={3}
              sx={{ color: "white", fontWeight: "bold", fontStyle: "Inter" }}
            >
              Create Tasks.
            </Typography>
          </Box>
          <Paper
            sx={{
              p: 4,
              borderRadius: 2,
              boxShadow: 4,
              bgcolor: "background.paper",
              width: "100%",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            <TextField
              value={text}
              onChange={(e) => setText(e.target.value)}
              label="Enter text"
              fullWidth
              multiline
              rows={4}
              variant={"outlined"}
              sx={{ mb: 2 }}
              focused={true} // make box persistent, can change if we change color palette
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
            >
              Generate Tasks
            </Button>
            <Box width={"100%"} mt={2}>
              {isLoading && <ProgressBar />}
            </Box>
          </Paper>
        </Box>
        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Stack item xs={12} md={6} mb={3}>
              <Typography
                variant={"h2"}
                align={"center"}
                textTransform={"capitalize"}
                my={3}
                sx={{ color: "white", fontWeight: "bold", fontStyle: "Inter" }}
              >
                Tasks Preview.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpen}
                size={"Large"}
                sx={{
                  width: "100%", // Makes the button the same width as the Typography
                  maxWidth: "400px", // Optional: cap the width if you want it smaller than Typography
                  margin: "0 auto", // Center the button if the width is smaller
                }}
              >
                Save Tasks as a Project
              </Button>
            </Stack>
            <Typography
              variant="h6"
              mb={3}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              Here's the list of tasks we found for you. Click any card to
              preview descriptions of the tasks. Save your collection to start
              checking tasks off.
            </Typography>

            <Grid container spacing={2}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={8} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      bgcolor: flipped[flashcard.id]
                        ? "gray"
                        : getPriorityColor(flashcard.priority), // color by priority, black when flipped to change shape
                    }}
                  >
                    <CardActionArea onClick={() => handleCardClick(index)}>
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
                              transform: flipped[index]
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
                              <div>
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
                              </div>
                            </div>
                            <div>
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
                            </div>
                          </Box>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Save Flashcard Set</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a name for your flashcard set.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant={"outlined"}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={saveFlashcards} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
