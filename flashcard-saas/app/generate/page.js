'use client'

import {useUser} from '@clerk/nextjs';
import {useEffect, useState} from "react";
import {useRouter} from 'next/navigation'
import {
    Box, Button, Card, CardActionArea, CardContent, Container, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, Grid, Paper, TextField,
    Typography
} from "@mui/material";
import {collection, doc, getDoc, setDoc, writeBatch} from "firebase/firestore";
import db from "@/firebase";


export default function Generate() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const [close, setClose] = useState()
    const router = useRouter()

    const handleSubmit = async () => {
        if (!text.trim()) {
            alert('Please enter some text to generate flashcards.')
            return
        }

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: text,
            })
                .then((res) => res.json())
                .then((data) => {setFlashcards(data)})
            if (!response.ok) {
                throw new Error('Failed to generate flashcards')
            }

            const data = await response.json()
            setFlashcards(data)
        } catch (error) {
            alert(error)
        }
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

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
                batch.set(docRef, flashcard)
            })

            await batch.commit()
            handleClose()
            router.push('/flashcards')
        } catch (error) {
            console.error('Error saving flashcards:', error)
        }

    }

    return (
        <Container maxWidth="md">
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
                </Paper>
            </Box>
            {flashcards.length > 0 && (
                <Box sx={{mt: 4, justifyContent: 'center'}}>
                    <Typography variant="h5" gutterBottom>
                        Flashcards Preview
                    </Typography>
                    <Grid container spacing={2}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={8} sm={6} md={4} key={index}>
                                <Card>
                                    <CardActionArea onClick={() => handleCardClick(index)}>
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
                    <Box sx={{mt: 4, justifyContent: 'center'}}>
                        <Button variant="contained" color="secondary" onClick={handleOpen}>
                            Save Flashcards
                        </Button>
                    </Box>
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

