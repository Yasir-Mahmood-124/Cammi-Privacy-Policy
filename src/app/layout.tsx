import type { Metadata } from "next";
import { CssBaseline } from "@mui/material";
import { Providers } from "./providers"; // 👈 import wrapper
import ThemeRegistry from "@/theme/Theme";

export const metadata: Metadata = {
  title: "Cammi.ai",
  description: "Landing page with privacy policy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <CssBaseline />
          <ThemeRegistry>{children}</ThemeRegistry>
        </Providers>
      </body>
    </html>
  );
}
