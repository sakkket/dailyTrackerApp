import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import SavingsIcon from "@mui/icons-material/Savings";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import moment from "moment";

const SummaryCards = ({ income, expenditure, saving, month }) => {
  const balance = income - (expenditure + saving);
  const cards = [
    {
      label: "Balance",
      amount: balance,
      icon: <CurrencyRupeeIcon fontSize="large" style={{ color: "green" }} />,
      color: "green",
    },
    {
      label: "Total Expenditure",
      amount: expenditure,
      icon: <ShoppingCartIcon fontSize="large" style={{ color: "red" }} />,
      color: "red",
    },
    {
      label: "Total Income",
      amount: income,
      icon: <CurrencyRupeeIcon fontSize="large" style={{ color: "green" }} />,
      color: "green",
    },
    {
      label: "Total Savings",
      amount: saving,
      icon: <SavingsIcon fontSize="large" style={{ color: "blue" }} />,
      color: "blue",
    },
  ];

  return (
    <Box width="100%">
      <Grid container spacing={2}>
        <Card
          elevation={3}
          sx={{
            backgroundColor: "#e3f2fd", // Light blue
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Summary for
                </Typography>
                <Typography variant="h6">
                 {moment(month).format('MMM YYYY')}
                  <KeyboardDoubleArrowRightIcon
                    fontSize="small"
                    style={{ color: "blue" }}
                  />
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  {card.icon}
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">
                      {card.label}
                    </Typography>
                    <Typography variant="h6" style={{ color: card.color }}>
                      ₹{card.amount.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SummaryCards;
