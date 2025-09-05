"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import { Bolt, TrendingUp, Remove, Add, ShoppingCart } from "@mui/icons-material";

interface CreditsData {
  planType: string;
  used: number;
  total: number;
  remaining: number;
}

interface CreditsSidebarProps {
  creditsData: CreditsData;
}

const CreditsSidebar: React.FC<CreditsSidebarProps> = ({ creditsData }) => {
  const usagePercentage = (creditsData.used / creditsData.total) * 100;

  return (
    <Box width={300} flexShrink={0}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid #e8f5e8",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fff8 100%)",
        }}
      >
        {/* Premium Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
            p: 3,
            color: "white",
            textAlign: "center",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            sx={{ mb: 1 }}
          >
            <Bolt />
            <Typography variant="h6" fontWeight={700}>
              {creditsData.planType} Plan
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Your content creation credits
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Usage Overview */}
          <Box sx={{ mb: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
              >
                Credit Usage
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                color="primary.main"
              >
                {creditsData.used}/{creditsData.total}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={usagePercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "#e8f5e8",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  background:
                    usagePercentage > 80
                      ? "linear-gradient(135deg, #f44336, #ff5722)"
                      : usagePercentage > 60
                      ? "linear-gradient(135deg, #ff9800, #ffc107)"
                      : "linear-gradient(135deg, #4caf50, #66bb6a)",
                },
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, display: "block" }}
            >
              {usagePercentage.toFixed(1)}% used this month
            </Typography>
          </Box>

          {/* Credit Stats */}
          <Stack spacing={2} sx={{ mb: 3 }}>
            {/* Total Credits */}
            <Card
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: "#f3f4f6",
                border: "1px solid #e5e7eb",
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <TrendingUp sx={{ color: "#6b7280", fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Total Credits
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {creditsData.total.toLocaleString()}
                </Typography>
              </Box>
            </Card>

            {/* Used Credits */}
            <Card
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: usagePercentage > 80 ? "#fef2f2" : "#fff7ed",
                border: `1px solid ${usagePercentage > 80 ? "#fecaca" : "#fed7aa"}`,
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <Remove
                    sx={{
                      color: usagePercentage > 80 ? "#ef4444" : "#f97316",
                      fontSize: 20,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Used Credits
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color={usagePercentage > 80 ? "error.main" : "warning.main"}
                >
                  {creditsData.used.toLocaleString()}
                </Typography>
              </Box>
            </Card>

            {/* Remaining Credits */}
            <Card
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: "#f0f9f0",
                border: "1px solid #c8e6c8",
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <Add sx={{ color: "#4caf50", fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Remaining
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  {creditsData.remaining.toLocaleString()}
                </Typography>
              </Box>
            </Card>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Action Button */}
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<ShoppingCart />}
            sx={{
              borderRadius: 3,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              background: "linear-gradient(135deg, #4caf50, #66bb6a)",
              boxShadow: "0 4px 15px rgba(76,175,80,0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #43a047, #4caf50)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(76,175,80,0.4)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Upgrade Plan
          </Button>

          {/* Additional Info */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mt: 2,
              display: "block",
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            Credits reset monthly. Unused credits don't roll over.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreditsSidebar;