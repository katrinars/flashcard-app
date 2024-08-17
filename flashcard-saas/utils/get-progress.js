import * as React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import {linearProgressClasses, Stack, styled, Typography} from "@mui/material";
import {useEffect, useState} from "react";

export default function ProgressBar() {
    const [message, setMessage] = useState('What a great idea...');


    useEffect(() => {
        const messages = [
            'What a great idea...',
            'Give me one second...',
            'I\'m working on it...',
            'Almost done...',
        ];
        let currentIndex = 0;

        const intervalId = setInterval(() => {
            currentIndex = (currentIndex + 1) % messages.length;
            setMessage(messages[currentIndex]);
        }, 3000); // Change message every 3 seconds

        return () => clearInterval(intervalId);
    }, []);

    const StyledProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
        },
    }));

    return (
        <Stack spacing={2} sx={{ width: '100%', mt:2 }}>
            <StyledProgress />
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 1 }}>
                {message}
            </Typography>
        </Stack>
    );
}
