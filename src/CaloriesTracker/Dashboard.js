import React, { useState } from "react";
import styles from "./Dashboard.module.css";
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
    Cell
} from "recharts";

function groupData(data, type) {
    const grouped = {};
    data.forEach((entry) => {
        const key = type === "daily" ? entry.date : entry.date.slice(0, 7); // YYYY-MM
        if (!grouped[key])
            grouped[key] = {
                date: key,
                cycling: 0,
                walking: 0,
                running: 0,
                totalCalories: 0
            };
        Object.keys(entry.calories).forEach((k) => {
            grouped[key][k] += entry.calories[k];
            grouped[key].totalCalories += entry.calories[k];
        });
    });
    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
}

export default function Dashboard({ data }) {
    const [view, setView] = useState("daily");
    const groupedData = groupData(data, view);

    const totalCaloriesSoFar = data.reduce((sum, entry) => {
        return sum + Object.values(entry.calories).reduce((a, b) => a + b, 0);
    }, 0);
    const latestData = groupedData[groupedData.length - 1] || {};

    const caloriesCategories = ["cycling", "walking", "running"];

    const getPieData = (sourceData, keys) =>
        keys.map((key) => ({ name: key, value: sourceData[key] || 0 })).filter((d) => d.value > 0);

    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c"];

    return (
        <div>
            <div className={styles.summary}>
                <h2>Total Calories Burnt so far: {totalCaloriesSoFar.toFixed(0)} KCAL</h2>
            </div>

            {/* existing toggle group and charts */}
            <div className={styles.toggleGroup}>
                {["daily", "monthly"].map((v) => (
                    <button
                        key={v}
                        className={view === v ? styles.activeToggle : styles.toggle}
                        onClick={() => setView(v)}
                    >
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                ))}
            </div>


            <div className={styles.chartGrid}>
                
                <Chart title="Calories Burnt" keys={caloriesCategories} data={groupedData} />
                <LineGraph title="Total Calories Burnt" data={groupedData} dataKey="totalCalories" color="#82ca9d" />
                <PieGraph title="Calories Burnt Breakdown" data={getPieData(latestData, caloriesCategories)} colors={COLORS} />
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
                    <Legend />
                    {keys.map((k, i) => (
                        <Bar key={k} dataKey={k} fill={["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c"][i % 6]} />
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
                    <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} />
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
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
