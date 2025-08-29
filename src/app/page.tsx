// app/page.tsx
"use client";

import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";

export default function HomePage() {
  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h2" gutterBottom>
        Welcome to Cammi.ai
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Empowering marketing with smart AI solutions.
      </Typography>
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          href="/privacy-policy"
        >
          View Privacy Policy
        </Button>
      </Box>
    </Container>
  );
}