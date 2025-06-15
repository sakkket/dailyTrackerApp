import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import {
  fetchUserExpenditure,
} from "../API/APIService";
import moment from "moment";
import { FaPlusCircle } from "react-icons/fa";
import { Container, Box, Button, Tooltip as MuiTooltip } from "@mui/material";
import SummaryCards from "./SummaryCard";
import MonthYearPicker from "./Calendar/MonthYearPicker";
import CustomBarChart from "./BarChart/CustomBarChart";
import CustomLineChart from "./LineChart/CustomLineChart";
import CategoryChart from "./CategoryChart/CategoryChart";
import CustomPieGraph from "./PieChart/CustomPieGraph";

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
  }, [refresh, view]);

  const expenditureCategories = {
    transport: "Transport",
    food: "Food & Drinks",
    groceries: "Groceries",
    rent: "Rent",
    loans: "Loans",
    entertainment: "Entertainment",
    clothes: "Clothes",
    internet: "Internet & Phone",
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
          <SummaryCards
            income={totalIncome}
            expenditure={totalExpenditure}
            saving={totalSavings}
            month={currentMonth}
            refresh= {refresh}
          />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={4}
          >
            {/* Left Component */}
            <MonthYearPicker onMonthChange={handleMonthChange} />
            <MuiTooltip title="Add New Transaction" arrow>
              <Button
                variant="contained"
                color="success"
                onClick={openAddExpense}
              >
                <FaPlusCircle style={{ marginRight: "8px" }} />
                Add
              </Button>
            </MuiTooltip>
          </Box>
        </Box>
      </Container>
      <div className={styles.chartGrid}>
        <CustomBarChart
          title={"Daily Expenditure: " + moment(currentMonth).format("MMMM YYYY")}
          keys={expenditureCategories}
          data={graphData}
          view={view}
        />
        <CustomLineChart
          title={"Daily Total Expenditure: " + moment(currentMonth).format("MMMM YYYY")}
          data={graphData}
          dataKey="totalExpenditure"
          color="#8884d8"
          view="daily"
        />
        <CategoryChart
          title={"Monthly Expenditure: " + moment(currentMonth).format("MMMM YYYY")}
          keys={expenditureCategories}
          data={categoryChart}
          view={view}
        />
        <CustomPieGraph
          title={"Monthly Expenditure Breakdown: " + moment(currentMonth).format("MMMM YYYY")}
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

