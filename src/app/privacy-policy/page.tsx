"use client";

import { Container, Typography, Box, Paper, Divider } from "@mui/material";

export default function PrivacyPolicyPage() {
  return (
    <Container maxWidth="md" sx={{ my: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {/* Title */}
        <Typography variant="h3" gutterBottom align="center" color="primary">
          Privacy Policy for Cammi.ai
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Effective Date: <strong>August 29, 2025</strong>
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Section 1 */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            <strong>1. Information We Collect</strong>
          </Typography>
          <Typography paragraph>
            <strong>Personal Information:</strong> Name, email address, company
            name, billing details, and any information you provide when you sign
            up or contact us. <br />
            <strong>Usage Data:</strong> How you interact with our site and
            platform, including IP address, browser type, device information, and
            pages visited. <br />
            <strong>Cookies & Tracking:</strong> We use cookies and similar
            technologies to improve your experience, analyze traffic, and for
            security.
          </Typography>
        </Box>

        {/* Section 2 */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            <strong>2. How We Use Information</strong>
          </Typography>
          <Typography paragraph>
            We use your information to provide and maintain services, process
            payments, improve Cammi.ai, communicate updates, ensure security, and
            comply with legal obligations.
          </Typography>
        </Box>

        {/* Section 3 */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            <strong>3. Sharing of Information</strong>
          </Typography>
          <Typography paragraph>
            We do not sell your information. We may share with service providers,
            for legal requirements, or in business transfers.
          </Typography>
        </Box>

        {/* Section 4 */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            <strong>4. Data Security</strong>
          </Typography>
          <Typography paragraph>
            We use reasonable measures to protect your data, but no system is
            100% secure.
          </Typography>
        </Box>

        {/* Section 5 */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            <strong>5. Data Retention</strong>
          </Typography>
          <Typography paragraph>
            We retain data only as long as necessary or required by law.
          </Typography>
        </Box>

        {/* Section 6 */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            <strong>6. Your Rights</strong>
          </Typography>
          <Typography paragraph>
            Depending on your location, you may request access, correction,
            deletion, or opt-out from marketing. <br />
            Contact us at: <strong>support@cammi.ai</strong>
          </Typography>
        </Box>

        {/* Section 7 */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            <strong>7. Cookies</strong>
          </Typography>
          <Typography paragraph>
            You can disable cookies in browser settings. Some features may not
            work properly.
          </Typography>
        </Box>

        {/* Section 8 */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            <strong>8. Third-Party Links</strong>
          </Typography>
          <Typography paragraph>
            We are not responsible for third-party site privacy practices.
          </Typography>
        </Box>

        {/* Section 9 */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            <strong>9. Children’s Privacy</strong>
          </Typography>
          <Typography paragraph>
            Cammi.ai is not directed to children under 18. We do not knowingly
            collect their data.
          </Typography>
        </Box>

        {/* Section 10 */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            <strong>10. Changes to This Policy</strong>
          </Typography>
          <Typography paragraph>
            We may update this policy from time to time. Updates will be posted
            here with the revised effective date.
          </Typography>
        </Box>

        {/* Section 11 */}
        <Box>
          <Typography variant="h6" gutterBottom>
            <strong>11. Contact Us</strong>
          </Typography>
          <Typography paragraph>
            <strong>Cammi.ai</strong> <br />
            Email: <strong>support@cammi.ai</strong> <br />
            Address: <strong>1001 Wilshire Boulevard #1164, Los Angeles, California, Zip 90017</strong> <br />
            Phone: <strong>+13159617073</strong>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
