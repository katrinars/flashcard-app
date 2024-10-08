'use client';

import {Box, Button, CircularProgress, Container, Typography} from '@mui/material';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

const ResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');
  const tier = searchParams.get('plan');

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!session_id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
            `/api/checkout_sessions?session_id=${session_id}`);
        const sessionData = await res.json();
        if (res.ok) {
          setSession(sessionData);
        } else {
          setError(sessionData.error);
        }
      } catch (err) {
        setError('An error occurred while retrieving the session.');
      } finally {
        setLoading(false);
      }
    };
    fetchCheckoutSession();
  }, [session_id]);

  if (loading) {
    return (
        <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
          <CircularProgress/>
          <Typography variant="h6" sx={{mt: 2}}>
            Loading...
          </Typography>
        </Container>
    );
  }

  if (error) {
    return (
        <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
          <Typography variant="h6" color="error">
            {err}
          </Typography>
        </Container>
    );
  }

  return (
      <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
        {session && session.payment_status === 'paid' ? (
            <>
              <Typography variant="h4">Thank you for subscribing to
                the {tier} Plan!</Typography>
              <Box sx={{mt: 2}}>
                <Typography variant="body1" padding={5}>
                  We have received your payment. You will receive an email with
                  the
                  order details shortly.
                </Typography>
                <Typography variant="body2" padding={5}>Session
                  ID: {session_id}</Typography>
                <Button href={'../'}>
                  Back to Home
                </Button>
              </Box>
            </>
        ) : (
            <>
              <Typography variant="h4">Payment failed</Typography>
              <Box sx={{mt: 2}}>
                <Typography variant="body1">
                  Your payment was not successful. Please try again.
                </Typography>
                <Button href={'../'}>
                  Back to Home
                </Button>
              </Box>
            </>
        )}
      </Container>
  );
};

export default ResultPage;