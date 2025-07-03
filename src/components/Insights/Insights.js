import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  useTheme,
} from '@mui/material';
import { TrendingUp, TrendingDown, Category, People } from '@mui/icons-material';

const InsightCard = ({ icon, title, value, subtitle, color }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        height: 130,
        maxWidth: 250,
        backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#e3f2fd',
        borderRadius: 3,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          {icon}
          <Typography variant="h7" sx={{ color: color || 'primary.main' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary' }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const UserInsights = ({ insights = {}}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4}>
        <InsightCard
          icon={<TrendingUp color="success" fontSize="large" />}
          title="Monthly Change"
          value={insights?.monthlyChange || '+0%'}
          subtitle="Compared to last month"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <InsightCard
          icon={<Category color="info" fontSize="large" />}
          title="Top Categories"
          value={insights?.topCategories?.join(', ') || 'N/A'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <InsightCard
          icon={<People color="warning" fontSize="large" />}
          title="Spend vs Others"
          value={insights?.averageSpendVsOthers || '0%'}
          subtitle="Compared to other users"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <InsightCard
          icon={<TrendingDown color="error" fontSize="large" />}
          title="Predicted Spend"
          value={`₹${insights?.predictedEndOfMonthSpend || 0}`}
          subtitle="Expected by month end"
        />
      </Grid>
      {insights?.warnings?.length > 0 && (
        <Grid item xs={12}>
          <InsightCard
            icon={<TrendingDown color="error" fontSize="large" />}
            title="Warnings"
            value={insights?.warnings.join(', ')}
            color="error.main"
          />
        </Grid>
      )}
    </Grid>
  );
};

export default UserInsights;
