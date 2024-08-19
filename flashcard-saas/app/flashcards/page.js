'use client';

import db from '@/firebase';
import {useUser, SignedIn, SignedOut, UserButton} from '@clerk/nextjs';
import {AppBar, Toolbar, Card, Button, CardActionArea, CardContent, Container, Grid, Typography} from '@mui/material';
import {collection, doc, getDoc, setDoc} from 'firebase/firestore';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

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
      <Container maxWidth="md">
        <AppBar position="static" sx={{bgcolor:'black',}}>
          <Container>
            <Toolbar>
              <Typography variant="h6" style={{flexGrow: 1, fontWeight: 'bold', fontStyle: 'Inter',}}>Cards Against Confusion</Typography> {/* change title */}
              <SignedOut>
                <Button color="inherit" href="/sign-in">Login</Button>
                <Button color="inherit" href="/sign-up">Sign Up</Button>
              </SignedOut>
              <SignedIn>
                <Button color="inherit" href="/flashcards">Projects</Button>
                <UserButton/>
              </SignedIn>
            </Toolbar>
          </Container>
        </AppBar>
        <Grid container spacing={3} sx={{mt: 4}} bgcolor={'pink'}>
          {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea
                      onClick={() => handleCardClick(flashcard.name)}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {flashcard.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
          ))}
        </Grid>
      </Container>
  );
}
