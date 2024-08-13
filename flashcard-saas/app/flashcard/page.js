'use client'

import {useUser} from "@clerk/nextjs";
import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {Box, Card, CardActionArea, CardContent, Container, Grid, Typography} from "@mui/material";
import {collection, doc, getDocs} from "firebase/firestore";
import db from "@/firebase";

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})

    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return

            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []
            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() })
            })
            setFlashcards(flashcards)
        }
        getFlashcard()
    }, [search, user])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    return (
        <Container maxWidth="md">
            <Box>
                <Typography variant={"h2"} align={"center"} textTransform={"uppercase"} my={3}>
                    {search} Flashcards
                </Typography>
            </Box>
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard) => (
                    <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                                <CardContent>
                                    <Box sx={{
                                        perspective: '1000px',
                                        '& > div': {
                                            transition: 'transform 0.6s',
                                            transformStyle: 'preserve-3d',
                                            position: 'relative',
                                            height: '200px',
                                            width: '100%',
                                            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                                            transform: flipped[flashcard.id]
                                                ? 'rotateY(180deg)'
                                                : 'rotateY(0deg)',
                                            borderRadius: 2,
                                            bgcolor: 'background.paper',
                                        },
                                        '& > div > div': {
                                            position: 'absolute',
                                            height: '100%',
                                            width: '100%',
                                            backfaceVisibility: 'hidden',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            boxSizing: 'border-box',
                                            borderRadius: 2,
                                            padding: 2,

                                        },
                                        '& > div > div:nth-of-type(2)': {
                                            transform: 'rotateY(180deg)'
                                        }
                                    }}>
                                        <div>
                                            <div>
                                                <Typography variant="h5" component="div">
                                                    {flashcard.front}
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography variant="h5" component="div">
                                                    {flashcard.back}
                                                </Typography>
                                            </div>
                                        </div>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}