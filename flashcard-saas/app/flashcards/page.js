'use client';

import db from '@/firebase';
import {useUser, SignedIn, SignedOut, UserButton} from '@clerk/nextjs';
import {Box, AppBar, Toolbar, Card, Button, CardActionArea, CardContent, Container, Grid, Typography} from '@mui/material';
import {collection, doc, getDoc, setDoc} from 'firebase/firestore';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import Link from "next/link";

export default function Flashcards() {
  const {isLoaded, isSignedIn, user} = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      const docRef = doc(collection(db, 'users'), user.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        setFlashcards(collections);
      } else {
        await setDoc(docRef, {flashcards: []});
      }
    }

    getFlashcards();
  }, [user]);

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#000000",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
              <Button color="inherit" href="/generate">Add Project</Button>
              <Button color="inherit" href="/flashcards">Projects</Button>
              <UserButton />
            </SignedIn>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
      <Container maxWidth="md">  
      <Box>
          <Typography variant={'h2'} align={'left'}
                      textTransform={'capitalize'} my={3} sx={{ color: "white",fontWeight: 'bold', fontStyle: 'Inter', }}>
            Projects.
          </Typography>
        </Box> 
        <Grid container spacing={3} sx={{mt: 4}} bgcolor={'black'}>
          {flashcards.map((flashcard, index) => (
              <Grid item xs={8} sm={6} md={4} key={index}>
                <Card sx={{
                  bgcolor: 'pink',
                }}>
                  <CardActionArea
                      onClick={() => handleCardClick(flashcard.name)}>
                    <CardContent>
                      <Box sx={{
                          perspective: '1000px',
                          '& > div': {
                            transition: 'transform 0.6s',
                            transformStyle: 'preserve-3d',
                            position: 'relative',
                            height: '372px',
                            width: '100%',
                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                            
                            borderRadius: 2,
                          },
                          '& > div > div': {
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            backfaceVisibility: 'hidden',
                            display: 'flex',
                            justifyContent: 'left',
                            alignItems: 'top',
                            boxSizing: 'border-box',
                            borderRadius: 2,
                            padding: 2,
                            bgcolor: 'white',
                          },
                          '& > div > div:nth-of-type(2)': {
                            transform: 'rotateY(180deg)',
                          },

                          }}>
                      <Box>
                        <div>
                          <Typography variant="h6" sx={{ color: 'black', fontSize: '1.5rem', fontWeight: 'bold', fontStyle: 'Inter',}} >
                            {flashcard.name}.
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
