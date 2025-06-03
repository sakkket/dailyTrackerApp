import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import { fetchUserExpenditure, fetchTotalUserExpenditureAndIncome } from "../API/APIService";
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
import moment from 'moment';
const MONTH = moment().format("MMMM YYYY");
export default function Dashboard({ refresh }) {
    const [totalExpenditure, setTotalExpenditureSoFar] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [pieChartData, setPieChartData] = useState({});
    const [view, setView] = useState("daily");
    const [graphData, setGraphData] = useState([]);
    async function fetchExpense(view) {
        try {
            setView(view);
            const groupBy = view === "daily" ? "day" : "month";
            const month = moment.utc().format('YYYY-MM');
            const expenseData = await fetchUserExpenditure(groupBy, month);
            if (expenseData && expenseData.length) {
                setGraphData(expenseData);
                setPieChartData(expenseData[expenseData.length -1])
            } else {
                setGraphData([]);
            }
        } catch { }
    }
    async function fetchTotalExpenseAndIncome() {
        try {
            const month = moment.utc().format('YYYY-MM');
            const totalExpenditureAndIncome = await fetchTotalUserExpenditureAndIncome(month);
            if (totalExpenditureAndIncome) {
                const totalExpenditure = (totalExpenditureAndIncome && totalExpenditureAndIncome.totalExpenses) ? totalExpenditureAndIncome.totalExpenses.totalAmount: 0;
                const totalIncome = (totalExpenditureAndIncome && totalExpenditureAndIncome.totalIncome) ? totalExpenditureAndIncome.totalIncome.totalAmount: 0;
                setTotalExpenditureSoFar(totalExpenditure);
                setTotalIncome(totalIncome);
            }
        } catch { }
    }
    useEffect(() => {
        fetchExpense(view);
        fetchTotalExpenseAndIncome();
    }, [refresh, view]); 
    const expenditureCategories = {
        transport: 'Transport',
        food: 'Food & Drinks',
        groceries: 'Groceries',
        rent: 'Rent',
        loans: 'Loans',
        entertainment: 'Entertainment',
        clothes: 'Clothes',
        internet: 'Internet & Phone',
        na: 'No Category',
        transfer: 'Fund Transfer',
        gadget: 'Gadget',
        car: 'Car Fuel & Maintainance'
    };
    const getPieData = (sourceData, keys) =>
        Object.keys(keys)
            .map((key) => ({ name: expenditureCategories[key], value: sourceData[key] || 0 }))
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
            <Summary income={totalIncome} expenditure={totalExpenditure} month={MONTH} />

            {/* existing toggle group and charts */}
            <div className={styles.toggleGroup}>
                {["daily", "monthly"].map((v) => (
                    <button
                        key={v}
                        className={view === v ? styles.activeToggle : styles.toggle}
                        onClick={() => fetchExpense(v)}
                    >
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                ))}
            </div>

            <div className={styles.chartGrid}>
                <Chart
                    title="Expenditure"
                    keys={expenditureCategories}
                    data={graphData}
                />
                <LineGraph
                    title="Total Expenditure"
                    data={graphData}
                    dataKey="totalExpenditure"
                    color="#8884d8"
                />
                <PieGraph
                    title="Expenditure Breakdown"
                    data={getPieData(pieChartData, expenditureCategories)}
                    colors={COLORS}
                />
            </div>
        </div>
    );
}

function Chart({ title, keys, data }) {
    return (
        <div className={styles.chartContainer}>
            <h3>{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend
                        formatter={(value) => keys[value] || value}
                    />
                    {Object.keys(keys).map((key, i) => (
                        <Bar key={key} dataKey={key} fill={
                            [
                                "#8884d8",
                                "#82ca9d",
                                "#ffc658",
                                "#ff8042",
                                "#8dd1e1",
                                "#a4de6c",
                            ][i % 6]
                        } name={keys[key]} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function LineGraph({ title, data, dataKey, color }) {
    return (
        <div className={styles.chartContainer}>
            <h3>{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

function PieGraph({ title, data, colors }) {
    return (
        <div className={styles.chartContainer}>
            <h3>{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Tooltip />
                    <Legend />
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={colors[index % colors.length]}
                            />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
