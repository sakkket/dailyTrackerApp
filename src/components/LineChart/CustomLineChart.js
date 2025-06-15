import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useTheme } from "@mui/material/styles";
import { parseISO, format } from "date-fns";
import styles from "./CustomLineChart.module.css";

const CustomLineChart = ({ title, data, view, dataKey, color }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const axisStroke = isDark ? "#e2e8f0" : "#4a5568";
  const tickFill = isDark ? "#e2e8f0" : "#2d3748";
  const gridStroke = isDark ? "#475569" : "#cbd5e0";
  const tooltipBg = isDark ? "#1e293b" : "#ffffff";
  const tooltipBorder = isDark ? "#475569" : "#cbd5e0";
  const tooltipText = isDark ? "#f1f5f9" : "#2d3748";
  const itemColor = isDark ? "#38bdf8" : color;
  const legendColor = isDark ? "#f1f5f9" : "#2d3748";

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.graphTitle}>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
          <XAxis
            dataKey="date"
            stroke={axisStroke}
            tick={{ fontSize: 12, fill: tickFill }}
            tickFormatter={(dateStr) =>
              format(parseISO(dateStr), view === "daily" ? "dd MMM" : "MMM yyyy")
            }
          />
          <YAxis
            stroke={axisStroke}
            tick={{ fontSize: 12, fill: tickFill }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              borderRadius: 8,
              border: `1px solid ${tooltipBorder}`,
            }}
            labelStyle={{ color: tooltipText, fontWeight: "bold" }}
            itemStyle={{ color: itemColor }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: 14, color: legendColor }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            name="Total Expenditure"
            stroke={itemColor}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
