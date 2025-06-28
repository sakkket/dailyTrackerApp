import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import { fetchUserExpenditure, getInsights } from "../API/APIService";
import moment from "moment";
import { FaPlusCircle } from "react-icons/fa";
import {
  Container,
  Box,
  Button,
  Tooltip as MuiTooltip,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SummaryCards from "./SummaryCard";
import MonthYearPicker from "./Calendar/MonthYearPicker";
import CustomBarChart from "./BarChart/CustomBarChart";
import CustomLineChart from "./LineChart/CustomLineChart";
import CategoryChart from "./CategoryChart/CategoryChart";
import CustomPieGraph from "./PieChart/CustomPieGraph";
import UserInsights from "./Insights/Insights";

export default function Dashboard({ refresh, openAddExpenseModal }) {
  const [totalExpenditure, setTotalExpenditureSoFar] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalSavings, setTotalSaving] = useState(0);
  const [pieChartData, setPieChartData] = useState({});
  const [categoryChart, setCategoryChart] = useState([]);
  const [view, setView] = useState("daily");
  const [graphData, setGraphData] = useState([]);
  const [graphDataYearly, setGraphDataYearly] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(moment().format("YYYY-MM"));
  const currentMonthOfYear = moment().format("YYYY-MM");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [insights, setInsights] = useState({})

  async function handleMonthChange(month) {
    setCurrentMonth(month);
    setCurrentMonth(month);
    fetchExpense(view, month);
    //fetchTotalExpenseAndIncome(month);
    fetchMonthlyExpense(month);
  }

  async function fetchExpense(view, selectedMonth) {
    try {
      setView(view);
      const groupBy = view === "daily" ? "day" : "month";
      const month = selectedMonth
        ? selectedMonth
        : currentMonth
        ? currentMonth
        : moment.utc().format("YYYY-MM");
      const expenseData = await fetchUserExpenditure(groupBy, month);
      if (expenseData && expenseData.length) {
        setGraphData(expenseData);
      } else {
        setGraphData([]);
      }
    } catch {}
  }

  function openAddExpense(e) {
    e.preventDefault();
    openAddExpenseModal();
  }
  const getCategoryData = (data) => {
    const categoryArray = [];
    if (data) {
      for (const key in data) {
        if (expenditureCategories[key] && data[key]) {
          categoryArray.push({
            category: expenditureCategories[key],
            value: data[key],
          });
        }
      }
    }
    return categoryArray;
  };

  async function fetchMonthlyExpense(selectedMonth) {
    try {
      const month = selectedMonth ? selectedMonth : currentMonth;
      const groupBy = "month";
      const expenseData = await fetchUserExpenditure(groupBy);
      if (expenseData && expenseData.length) {
        setGraphDataYearly(expenseData);
        const pieChartData =
          expenseData.find((data) => data.date === month) || [];
        setPieChartData(pieChartData);
        setCategoryChart(getCategoryData(pieChartData));
      } else {
        setGraphDataYearly([]);
        setPieChartData([]);
        setCategoryChart([]);
      }
    } catch {}
  }

  useEffect(() => {
    fetchExpense(view);
    fetchMonthlyExpense();
    getInsights(currentMonthOfYear)
    .then((res)=> setInsights(res));
  }, [refresh, view]);

  const expenditureCategories = {
    transport: "Transport",
    food: "Food & Drinks",
    groceries: "Groceries",
    rent: "Rent",
    loans: "Loan",
    entertainment: "Entertainment",
    clothes: "Clothes",
    internet: "Internet & Phone & Electricty",
    na: "No Category",
    transfer: "Fund Transfer",
    gadget: "Gadget",
    car: "Car Fuel & Maintainance",
    health: "Health & Grooming",
  };
  const getPieData = (sourceData, keys) =>
    Object.keys(keys)
      .map((key) => ({
        name: expenditureCategories[key],
        value: sourceData[key] || 0,
      }))
      .filter((d) => d.value > 0);

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#8dd1e1",
    "#a4de6c",
  ];

  return (
    <div>
      <Container maxWidth="lg">
        <Box mt={2}>
          <Typography variant="h6" fontWeight={500}>
            Summary
          </Typography>

          <SummaryCards
            income={totalIncome}
            expenditure={totalExpenditure}
            saving={totalSavings}
            month={currentMonth}
            refresh={refresh}
          />
          <Typography variant="h6" mt={4} fontWeight={500}>
            Insights & Trends
          </Typography>
          <Box mt={2}>
            <UserInsights insights={insights}/>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={4}
          >
            {/* Left Component */}
            <MonthYearPicker onMonthChange={handleMonthChange} />
            <Box
              sx={{
                position: "fixed",
                bottom: { xs: 16, sm: 24 }, // responsive bottom spacing
                right: { xs: 16, sm: 24 }, // responsive right spacing
                zIndex: 1300, // ensure it's above other components
              }}
            >
              <MuiTooltip title="Add New Transaction" arrow>
                {isSmallScreen ? (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={openAddExpense}
                    sx={{
                      minWidth: 0,
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      padding: 0,
                    }}
                  >
                    <FaPlusCircle size={24} />
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={openAddExpense}
                    startIcon={<FaPlusCircle size={20} />}
                    sx={{
                      px: 2, // horizontal padding
                      py: 1.5, // vertical padding
                      fontSize: "1rem", // increase font size
                      borderRadius: "10px", // optional: rounder edges
                    }}
                  >
                    Add
                  </Button>
                )}
              </MuiTooltip>
            </Box>
          </Box>
        </Box>
      </Container>
      <div className={styles.chartGrid}>
        <CustomBarChart
          title={
            "Daily Expenditure: " + moment(currentMonth).format("MMMM YYYY")
          }
          keys={expenditureCategories}
          data={graphData}
          view={view}
        />
        <CustomLineChart
          title={
            "Daily Total Expenditure: " +
            moment(currentMonth).format("MMMM YYYY")
          }
          data={graphData}
          dataKey="totalExpenditure"
          color="#8884d8"
          view="daily"
        />
        <CategoryChart
          title={
            "Monthly Expenditure: " + moment(currentMonth).format("MMMM YYYY")
          }
          keys={expenditureCategories}
          data={categoryChart}
          view={view}
        />
        <CustomPieGraph
          title={
            "Monthly Expenditure Breakdown: " +
            moment(currentMonth).format("MMMM YYYY")
          }
          data={getPieData(pieChartData, expenditureCategories)}
          colors={COLORS}
        />
        <CustomLineChart
          title={"Monthly Expenditure: " + moment(currentMonth).format("YYYY")}
          data={graphDataYearly}
          dataKey="totalExpenditure"
          color="#8884d8"
          view="monthly"
        />
      </div>
    </div>
  );
}
