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
    const [hoveredCard, setHoveredCard] = useState(null)

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
            // Sort flashcards by priority (high to low)
            flashcards.sort((a, b) => a.priority - b.priority)
            setFlashcards(flashcards)
        }
        getFlashcard()
    }, [search, user])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    };

    const getPriorityColor = (priority) => {
        const colors = {
            1: 'red',
            2: 'orange',
            3: 'yellow',
            4: 'green',
            5: 'blue',
        };
        return colors[priority] || 'white'; // default white
    };

    return (
        <Container >
            <Box>
                <Typography variant={"h2"} align={"center"} textTransform={"uppercase"} my={3}>
                    {search} Flashcards
                </Typography>
            </Box>
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard) => (
                    <Grid item xs={8} sm={6} md={4} key={flashcard.id}>
                        <Card sx={{
                            bgcolor: flipped[flashcard.id] ? 'black' : getPriorityColor(flashcard.priority), // color by priority, black when flipped to change shape
                        }}>
                            <CardActionArea
                                onClick={() => handleCardClick(flashcard.id)}
                                onMouseEnter={() => setHoveredCard(flashcard.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
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
                                            bgcolor: 'white',
                                        },
                                        '& > div > div:nth-of-type(2)': {
                                            transform: 'rotateY(180deg)',
                                        }
                                    }}>
                                        <Box>
                                            <div>
                                                {hoveredCard === flashcard.id ? (
                                                    <Typography variant="body2" sx={{ color: 'black' }}>
                                                        {flashcard.description}
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="h6" sx={{ color: 'black' }}>
                                                        {flashcard.title}
                                                    </Typography>
                                                )}
                                            </div>
                                            <div>
                                                <Typography variant="body1" sx={{ color: 'black' }}>
                                                    {flashcard.tagline}
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
    )
}