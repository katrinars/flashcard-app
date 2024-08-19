import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function AppLayout({ children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "transparent", boxShadow: "none" }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link
              href="/"
              passHref
              style={{ color: "white", textDecoration: "none" }}
            >
              Cards Against Confusion
            </Link>
          </Typography>
          {/* Commented out Pricing and FAQ links
          <Button color="inherit" component={Link} href="/pricing">
            Pricing
          </Button>
          <Button color="inherit" component={Link} href="/faq">
            FAQ
          </Button>
          */}
          <SignedOut>
            <Button color="inherit" component={Link} href="/sign-in">
              Sign In
            </Button>
            <Button color="inherit" component={Link} href="/sign-up">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
}
