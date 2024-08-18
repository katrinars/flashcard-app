'use client';
import getStripe from '@/utils/get-stripe';
import {SignedIn, SignedOut, UserButton} from '@clerk/nextjs';
import {AppBar, Box, Button, Container, Grid, Toolbar, Typography} from '@mui/material';

export default function Home() {
  const handleSubmit = async (plan) => {

    const checkoutSession = await fetch('../api/checkout_sessions', {
      method: 'POST',
      headers:
          {'Content-Type': 'application/json'},
      body: JSON.stringify({plan}),
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.status === 500) {
      console.error('Error creating checkout session:',
          checkoutSessionJson.error.message);
      return;
    }

    const stripe = await getStripe();
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return (
      <Container maxWidth={'xxl'} disableGutters>

        <AppBar position="static">
          <Container>
            <Toolbar>
              <Typography variant="h6" style={{flexGrow: 1}}>Flashcard
                SaaS</Typography> {/* change title */}
              <SignedOut>
                <Button color="inherit" href="/sign-in">Login</Button>
                <Button color="inherit" href="/sign-up">Sign Up</Button>
              </SignedOut>
              <SignedIn>
                <UserButton/>
              </SignedIn>
            </Toolbar>
          </Container>
        </AppBar>
        <Container>
          <Box sx={{textAlign: 'center', my: 4}}>
            <Typography variant="h2" component="h1" gutterBottom>
              Welcome to Flashcard SaaS
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              {' '}
              The easiest way to create flashcards from your text.
            </Typography>
            <Button variant="contained" color="primary" sx={{mt: 2, mr: 2}}
                    href="/generate">
              Get Started
            </Button>
            <Button variant="outlined" color="primary"
                    sx={{mt: 2}}> {/* need to add link and content if including */}
              Learn More
            </Button>
          </Box>
          <Box sx={{my: 6, textAlign: 'center'}}>
            <Typography variant="h4" component="h2" gutterBottom
                        textAlign={'center'}>
              Features
            </Typography>
            <Grid container spacing={4}>
              <Box
                  sx={{
                    display: 'flex',
                    padding: '20px',
                  }}
              >
                <Grid item xs={12} md={4} px={2}>
                  <Typography variant="h6">Sleek Design</Typography>
                  <Typography>
                    {' '}
                    You can create flashcards with a sleek design that is easy
                    to use.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4} px={2}>
                  <Typography variant="h6">One Monthly Price</Typography>
                  <Typography>
                    {' '}
                    For one monthly price, you can create as many flashcards as
                    you want.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4} px={2}>
                  <Typography variant="h6">Access on Any Device</Typography>
                  <Typography>
                    {' '}
                    Use the app on any device, including your phone, tablet, or
                    computer.
                  </Typography>
                </Grid>
              </Box>
            </Grid>
          </Box>

          <Box sx={{my: 6, textAlign: 'center'}}>
            <Typography variant="h4" gutterBottom>Pricing</Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box                            // box around student plan
                    sx={{
                      p: 3,
                      border: '1px solid #ccc',
                      borderColor: 'primary.main',
                      borderRadius: '5px',
                      height: '100%',
                    }}
                >
                  <Typography variant="h6">
                    Student - $3 / mo
                  </Typography>
                  <Typography>
                    {' '}
                    3 flashcards per month. Perfect for students.
                  </Typography>
                  <Button variant="outlined" color="primary" sx={{mt: 2, mr: 2}}
                          onClick={() => handleSubmit('Student')}>
                    CHOOSE STUDENT
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box                            // box around pro plan
                    sx={{
                      p: 3,
                      border: '1px solid #ccc',
                      borderColor: 'primary.main',
                      borderRadius: '5px',
                      height: '100%',
                    }}
                >
                  <Typography variant="h6">
                    Pro - $10 / mo
                  </Typography>
                  <Typography>
                    {' '}
                    Up to 20 flashcards per month. Perfect for personal use.
                  </Typography>
                  <Button variant="outlined" color="primary" sx={{mt: 2, mr: 2}}
                          onClick={() => handleSubmit('Pro')}>
                    CHOOSE PRO
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Container>
  );
}