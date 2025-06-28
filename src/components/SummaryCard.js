import React, { useState, useEffect} from "react";
import { useRef } from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import EuroIcon from '@mui/icons-material/Euro';
import CurrencyYenIcon from '@mui/icons-material/CurrencyYen';
import CurrencyYuanIcon from '@mui/icons-material/CurrencyYuan';

import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import SavingsIcon from "@mui/icons-material/Savings";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { fetchTotalUserExpenditureAndIncome } from "../API/APIService";
import { useGlobalStore } from "../store/globalStore";
import moment from "moment";
import {
  useTheme,
  useMediaQuery,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
} from "@mui/material";

const SummaryCards = ({ income, expenditure, saving, month, refresh }) => {
  const currentMonth = moment().format('MMM YYYY');
  const currentYear = moment().format('YYYY');
  const [open, setOpen] = useState(false);
  const [summaryFilter, setSummaryFilter] = useState("month");
  const [totalExpenditure, setTotalExpenditureSoFar] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalSaving, setTotalSaving] = useState(0);
  const currencyCode = useGlobalStore((state) => state.currencyCode);
  const currencySymbol = useGlobalStore((state) => state.currencySymbol);

  const currencyIconMapper = {
    'INR': CurrencyRupeeIcon,
    'USD': AttachMoneyIcon,
    'EUR': EuroIcon,
    'GBP': CurrencyPoundIcon,
    'JPY': CurrencyYenIcon,
    'CNY': CurrencyYuanIcon,
  }
  async function fetchTotalExpenseAndIncome(selectedSummary) {
    try {
      const payload = {
        month: selectedSummary === 'month'? moment().format("YYYY-MM"): '',
        year: selectedSummary === 'year'? currentYear :''
      }
      const totalExpenditureAndIncome = await fetchTotalUserExpenditureAndIncome(payload);
      if (totalExpenditureAndIncome) {
        const totalExpenditure =
          totalExpenditureAndIncome && totalExpenditureAndIncome.totalExpenses
            ? totalExpenditureAndIncome.totalExpenses
            : 0;
        const totalIncome =
          totalExpenditureAndIncome && totalExpenditureAndIncome.totalIncome
            ? totalExpenditureAndIncome.totalIncome
            : 0;
        const totalSaving =
          totalExpenditureAndIncome && totalExpenditureAndIncome.totalIncome
            ? totalExpenditureAndIncome.totalSavings
            : 0;
        setTotalExpenditureSoFar(totalExpenditure);
        setTotalIncome(totalIncome);
        setTotalSaving(totalSaving);
      }
    } catch {}
  }

  const handleChange = (event) => {
    const summaryValue = event.target.value;
    setSummaryFilter(summaryValue);
    setOpen(false);
    fetchTotalExpenseAndIncome(summaryValue);
  };
  const iconRef = useRef(null);

  const CurrencyDisplay = ({ currencyCode, balance }) => {
  const IconComponent = currencyIconMapper[currencyCode] || AttachMoneyIcon;
  return (
    <IconComponent
      fontSize="large"
      style={{ color: balance < 0 ? 'red' : 'green' }}
    />
  );
};

const TotalIncomeDisplay = ({ currencyCode }) => {
  const IconComponent = currencyIconMapper[currencyCode] || AttachMoneyIcon;
  return (
    <IconComponent
      fontSize="large"
      style={{ color: "green" }} 
    />
  );
};


  const balance = totalIncome - (totalExpenditure + totalSaving);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const cards = [
    {
      label: "Balance",
      amount: balance,
      icon: <CurrencyDisplay currencyCode={currencyCode} balance={balance} />,
      color: balance < 0 ?"red":"green",
    },
    {
      label: "Total Expenditure",
      amount: totalExpenditure,
      icon: <ShoppingCartIcon fontSize="large" style={{ color: "red" }} />,
      color: "red",
    },
    {
      label: "Total Income",
      amount: totalIncome,
      icon: <TotalIncomeDisplay currencyCode={currencyCode}/>,
      color: "green",
    },
    {
      label: "Total Savings",
      amount: totalSaving,
      icon: <SavingsIcon fontSize="large" style={{ color: "green" }} />,
      color: "green",
    },
  ];

  useEffect(() => {
    fetchTotalExpenseAndIncome(summaryFilter);
  }, [refresh]);

  if (isSmallScreen)
    return (
      <Box width="100%" mt={2}>
        <Grid item spacing={3}>
           <Card
            elevation={4}
            sx={{
              minWidth: 200,
              flex: 1,
              py: 1.5,
              px: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              ...(theme.palette.mode === "light" && {
                backgroundColor: "#e3f2fd",
                borderRadius: 3,
              }),
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Summary for
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="h6" sx={{ mr: 1 }}>
                  {summaryFilter === "month"
                    ? currentMonth
                    : summaryFilter === "year"
                    ? currentYear
                    : "All Time"}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setOpen(true)}
                  ref={iconRef}
                  sx={{ p: 0.5 }}
                >
                  <KeyboardDoubleArrowDownIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* Visually hidden Select but keeps menu aligned to icon */}
            <FormControl sx={{ width: 0, height: 0, overflow: "hidden" }}>
              <Select
                open={open}
                onClose={() => setOpen(false)}
                value={summaryFilter}
                onChange={handleChange}
                MenuProps={{
                  anchorEl: iconRef.current,
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                }}
              >
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
                <MenuItem value="all">All Time</MenuItem>
              </Select>
            </FormControl>
          </Card>

          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} key={index} mt={2}>
              <Card elevation={4}
              sx={{ borderRadius: 3}}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    {card.icon}
                    <Box>
                      <Typography variant="subtitle1" color="text.secondary">
                        {card.label}
                      </Typography>
                      <Typography variant="h6" style={{ color: card.color }}>
                        {(currencySymbol || '₹') + card.amount.toLocaleString()}
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
  else {
    return (
      <Box width="100%" mt={2}>
        <Grid container spacing={2}>
          <Card
            elevation={4}
            sx={{
              maxWidth: 150,
              flex: 1,
              py: 1.5,
              px: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              ...(theme.palette.mode === "light" && {
                backgroundColor: "#e3f2fd",
                borderRadius: 3,
              }),
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Summary for
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="h8" sx={{ mr: 1 }}>
                  {summaryFilter === "month"
                    ? currentMonth
                    : summaryFilter === "year"
                    ? currentYear
                    : "All Time"}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setOpen(true)}
                  ref={iconRef}
                  sx={{ p: 0.5 }}
                >
                  <KeyboardDoubleArrowRightIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* Visually hidden Select but keeps menu aligned to icon */}
            <FormControl sx={{ width: 0, height: 0, overflow: "hidden" }}>
              <Select
                open={open}
                onClose={() => setOpen(false)}
                value={summaryFilter}
                onChange={handleChange}
                MenuProps={{
                  anchorEl: iconRef.current,
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                }}
              >
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
                <MenuItem value="all">All Time</MenuItem>
              </Select>
            </FormControl>
          </Card>

          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card elevation={3} sx={{ borderRadius: 3}} sm={6} md={3}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    {card.icon}
                    <Box>
                      <Typography variant="subtitle1" color="text.secondary">
                        {card.label}
                      </Typography>
                      <Typography variant="h6" style={{ color: card.color }}>
                        {(currencySymbol || '₹') + card.amount.toLocaleString()}
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
  }
};

export default SummaryCards;
