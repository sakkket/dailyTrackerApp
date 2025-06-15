import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import { useTheme } from "@mui/material/styles";
import styles from "./CustomBarChart.module.css";

const lightColors = [
  "#4b0082", "#006400", "#b8860b", "#8b0000", "#008b8b",
  "#556b2f", "#2f4f4f", "#483d8b", "#800000", "#2e8b57",
  "#5f9ea0", "#6b8e23", "#7b68ee", "#a52a2a", "#4682b4",
];

const darkColors = [
  "#c084fc", "#86efac", "#fde68a", "#f87171", "#5eead4",
  "#a3e635", "#facc15", "#d8b4fe", "#f9a8d4", "#93c5fd",
  "#fdba74", "#fb7185", "#34d399", "#a78bfa", "#fcd34d",
];

const CustomBarChart = ({ data, view, title, keys }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const barColors = isDarkMode ? darkColors : lightColors;
  const axisStroke = isDarkMode ? "#e2e8f0" : "#475569";
  const tickFill = isDarkMode ? "#e2e8f0" : "#334155";
  const gridStroke = isDarkMode ? "#475569" : "#cbd5e1";
  const tooltipBg = isDarkMode ? "#1e293b" : "#ffffff";
  const tooltipText = isDarkMode ? "#f1f5f9" : "#1e293b";
  const tooltipBorder = isDarkMode ? "#475569" : "#cbd5e1";
  const legendColor = isDarkMode ? "#f1f5f9" : "#475569";

  return (
   <div className={styles.chartContainer}>
      <h3 className={styles.graphTitle}>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />

          <XAxis
            dataKey="date"
            stroke={axisStroke}
            tick={{ fontSize: 12, fill: tickFill }}
            axisLine={{ stroke: gridStroke }}
            tickLine={false}
            tickFormatter={(dateStr) =>
              format(parseISO(dateStr), view === "daily" ? "dd MMM" : "MMM yyyy")
            }
          />

          <YAxis
            stroke={axisStroke}
            tick={{ fontSize: 12, fill: tickFill }}
            axisLine={{ stroke: gridStroke }}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: 8,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
            }}
            labelStyle={{ color: tickFill, fontWeight: "bold" }}
            itemStyle={{ color: tooltipText }}
          />

          <Legend
            wrapperStyle={{ fontSize: 10, color: legendColor }}
            formatter={(value) => keys[value] || value}
          />

          {Object.keys(keys).map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              fill={barColors[i % barColors.length]}
              name={keys[key]}
              barSize={40}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
