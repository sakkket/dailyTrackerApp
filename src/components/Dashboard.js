import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import { format, parseISO } from "date-fns";
import {
  fetchUserExpenditure,
  fetchTotalUserExpenditureAndIncome,
} from "../API/APIService";
import Summary from "./Summary";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FaPlusCircle, FaMoneyBillWave } from "react-icons/fa";
import { Container, Box, Button, TextField, IconButton } from "@mui/material";
import SummaryCards from "./SummaryCardNew";
import MonthYearPicker from "./calendar/MonthYearPicker";

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
    fetchTotalExpenseAndIncome(month);
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

  async function fetchTotalExpenseAndIncome(selectedMonth) {
    try {
      const totalExpenditureAndIncome =
        await fetchTotalUserExpenditureAndIncome(
          selectedMonth ? selectedMonth : currentMonth
        );
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
  useEffect(() => {
    fetchExpense(view);
    fetchTotalExpenseAndIncome();
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
          />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={4}
          >
            {/* Left Component */}
            <MonthYearPicker onMonthChange={handleMonthChange} />

            <Button
              variant="contained"
              color="success"
              onClick={openAddExpense}
            >
              <FaPlusCircle style={{ marginRight: "8px" }} /> Add
            </Button>
          </Box>
        </Box>
      </Container>
      <div className={styles.chartGrid}>
        <Chart
          title="Daily Expenditure"
          keys={expenditureCategories}
          data={graphData}
          view={view}
        />
        <LineGraph
          title="Daily Total Expenditure"
          data={graphData}
          dataKey="totalExpenditure"
          color="#8884d8"
          view="daily"
        />
        <CategoryChart
          title="Montly Expenditure Breakdown"
          keys={expenditureCategories}
          data={categoryChart}
          view={view}
        />
        <PieGraph
          title="Monthly Expenditure Breakdown"
          data={getPieData(pieChartData, expenditureCategories)}
          colors={COLORS}
        />
        <LineGraph
          title="Monthly Expenditure"
          data={graphDataYearly}
          dataKey="totalExpenditure"
          color="#8884d8"
          view="monthly"
        />
      </div>
    </div>
  );
}

function Chart({ title, keys, data, view }) {
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.graphTitle}>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            stroke="#475569"
            tick={{ fontSize: 12, fill: "#334155" }}
            axisLine={{ stroke: "#cbd5e1" }}
            tickLine={false}
            tickFormatter={(dateStr) =>
              format(
                parseISO(dateStr),
                view === "daily" ? "dd MMM" : "MMM yyyy"
              )
            }
          />

          <YAxis
            stroke="#475569"
            tick={{ fontSize: 12, fill: "#334155" }}
            axisLine={{ stroke: "#cbd5e1" }}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
            }}
            labelStyle={{ color: "#334155", fontWeight: "bold" }}
            itemStyle={{ color: "#1e293b" }}
          />

          <Legend
            wrapperStyle={{ fontSize: 10, color: "#475569" }}
            formatter={(value) => keys[value] || value}
          />

          {Object.keys(keys).map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              fill={
                [
                  "#8884d8", // purple
                  "#82ca9d", // green
                  "#ffc658", // yellow
                  "#ff8042", // orange
                  "#8dd1e1", // teal
                  "#a4de6c", // lime
                  "#d0ed57", // light green
                  "#a28fd0", // lavender
                  "#f49ac2", // pink
                  "#b0c4de", // light steel blue
                  "#f4a460", // sandy brown
                  "#ff7f50", // coral
                  "#7fc97f", // soft green
                  "#beaed4", // soft purple
                  "#fdc086", // soft orange
                ][i % 15]
              }
              name={keys[key]}
              barSize={40}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function CategoryChart({ title, keys, data, view }) {
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.graphTitle}>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="category"
            tick={{ fontSize: 10, fill: "#2d3748", fontWeight: 500 }}
            angle={-40}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            stroke="#475569"
            tick={{ fontSize: 12, fill: "#334155" }}
            axisLine={{ stroke: "#cbd5e1" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
            }}
            labelStyle={{ color: "#334155", fontWeight: "bold" }}
            itemStyle={{ color: "#1e293b" }}
          />
          <Bar dataKey="value" fill="#1976d2" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function LineGraph({ title, data, dataKey, color, view }) {
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.graphTitle}>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            stroke="#4a5568"
            tick={{ fontSize: 12, fill: "#2d3748" }}
            tickFormatter={(dateStr) =>
              format(
                parseISO(dateStr),
                view === "daily" ? "dd MMM" : "MMM yyyy"
              )
            }
          />
          <YAxis
            stroke="#4a5568"
            tick={{ fontSize: 12, fill: "#2d3748" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: 8,
              borderColor: "#cbd5e0",
            }}
            labelStyle={{ color: "#2d3748", fontWeight: "bold" }}
            itemStyle={{ color: "#2b6cb0" }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: 14, color: "#2d3748" }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            name="Total Expenditure"
            stroke={color}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function PieGraph({ title, data, colors }) {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    if (percent * 100 < 10) return null; // 💡 Skip labels below 15%
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.graphTitle}>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: 12,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
            }}
            labelStyle={{ color: "#334155", fontWeight: "bold" }}
            itemStyle={{ color: "#1e293b" }}
          />
          <Legend
            wrapperStyle={{
              fontSize: 14,
              color: "#475569",
            }}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  [
                    "#8884d8", // purple
                    "#82ca9d", // green
                    "#ffc658", // yellow
                    "#ff8042", // orange
                    "#8dd1e1", // teal
                    "#a4de6c", // lime
                    "#d0ed57", // light green
                    "#a28fd0", // lavender
                    "#f49ac2", // pink
                    "#b0c4de", // light steel blue
                    "#f4a460", // sandy brown
                    "#ff7f50", // coral
                    "#7fc97f", // soft green
                    "#beaed4", // soft purple
                    "#fdc086", // soft orange
                  ][index % 15]
                }
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
