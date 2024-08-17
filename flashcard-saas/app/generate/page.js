'use client'

import {useUser} from '@clerk/nextjs';
import {useState} from "react";
import {useRouter} from 'next/navigation'
import {
    Box, Button, Card, CardActionArea, CardContent, Container, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, Grid, Paper, TextField,
    Typography
} from "@mui/material";
import {collection, doc, getDoc, setDoc, writeBatch} from "firebase/firestore";
import db from "@/firebase";
import ProgressBar from "@/utils/get-progress";

export default function Generate() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const [close, setClose] = useState()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!text.trim()) {
            alert('We\'re good, but not that good. Type a sentence or two about what you need to plan.')
            return
        }

        setIsLoading(true);

        try {
            const response = await fetch('./api/generate', {
                method: 'POST',
                body: text,
            })
            const cards = await response.json();
            const sortedCards = cards.sort((a, b) => a.priority - b.priority);
            setFlashcards(sortedCards);
        } catch (error) {
            alert(error)
        } finally {
            setIsLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            1: 'red',
            2: 'orange',
            3: 'green',
            4: 'blue',
            5: 'purple',
        };
        return colors[priority] || 'black'; // black as default
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    };

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setClose(false)
    }

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name for your flashcard set.')
            return
        }

        try {
            const batch = writeBatch(db)
            const userDocRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(userDocRef)

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                if (collections.find((f) => f.name === name)) {
                    alert('Name already exists. Choose a different one.')
                    return
                }
                else {
                    collections.push({name})
                    batch.set(userDocRef, {flashcards: collections}, {merge: true})
                }
            } else {
                batch.set(userDocRef, {flashcards: [{name}]})
            }

            // const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName)
            // batch.set(setDocRef, {flashcards})

            const flashcardRef = collection(userDocRef, name)
            flashcards.forEach((flashcard) => {
                const docRef = doc(flashcardRef)
                batch.set(docRef, {
                    ...flashcard,
                    priority: flashcard.priority || 3
                })
            })

            await batch.commit()
            handleClose()
            router.push('/flashcards')
        } catch (error) {
            console.error('Error saving flashcards:', error)
        }

    }

    return (
        <Container>
            <Box sx={{
                mt: 4,
            }}
            >
                <Typography variant="h4" gutterBottom>
                    Generate Flashcards
                </Typography>
                <Paper sx={{
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 4,
                    bgcolor: 'background.paper',
                    width: '100%',
                }}>
                    <TextField
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        label="Enter text"
                        fullWidth
                        multiline
                        rows={4}
                        variant={"outlined"}
                        sx={{mb: 2}}
                        focused={true} // make box persistent, can change if we change color palette
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        fullWidth
                    >
                        Generate Flashcards
                    </Button>
                    <Box width={"100%"} mt={2}>
                        {isLoading && <ProgressBar />}
                    </Box>
                </Paper>
            </Box>
            {flashcards.length > 0 && (
                <Box sx={{mt: 4}}>

                    <Grid container spacing={4} mx={6} mt={4} justifyContent={"space-around"}>
                        <Grid item xs={12} md={6} mb={3} textTransform={'uppercase'}>
                                <Typography variant="h3" >
                                    Flashcard Preview
                                </Typography>

                        </Grid>
                        <Grid item xs={12} md={6} mb={3} >
                                <Button variant="contained" color="secondary" onClick={handleOpen} size={"large"}>
                                    Save Flashcards for Task Descriptions
                                </Button>
                        </Grid>
                    </Grid>
                    <Typography variant="h6" mb={3}>
                        Here's the list of tasks we found for you. Click any card to preview descriptions of the tasks. Save your collection to start checking tasks off.
                    </Typography>

                    <Grid container spacing={2}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={8} sm={6} md={4} key={index}>
                                <Card sx={{
                                    bgcolor: flipped[flashcard.id] ? 'gray' : getPriorityColor(flashcard.priority) // color by priority, black when flipped to change shape
                                }}>
                                    <CardActionArea
                                        onClick={() => handleCardClick(index)}>
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
                                                    transform: flipped[index]
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
                                                    transform: 'rotateY(180deg)'
                                                }
                                            }}>
                                                <Box>
                                                    <div>
                                                        <div>
                                                            <Typography variant="h6" sx={{color: 'black'}}>
                                                                {flashcard.title}
                                                            </Typography>
                                                        </div>

                                                    </div>
                                                    <div>
                                                        <Typography variant="body2" sx={{color: 'black'}}>
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
                        variant={'outlined'}
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
    )

}