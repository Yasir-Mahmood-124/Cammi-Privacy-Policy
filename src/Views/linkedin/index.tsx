// src/Views/linkedin/index.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import LinkedInPostForm from "./LinkedInPostForm";

const Linkedin = () => {
  const [sub, setSub] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSub = localStorage.getItem("linkedin_sub");
      if (storedSub) setSub(storedSub);
    }
  }, []);

  if (!sub) {
    return <div>Please log in to continue</div>; // Or a loader
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <LinkedInPostForm sub={sub} />
    </Container>
  );
};

export default Linkedin;
