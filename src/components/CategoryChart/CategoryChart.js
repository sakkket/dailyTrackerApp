import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LabelList
} from "recharts";
import { useTheme } from "@mui/material/styles";
import styles from "./CategoryChart.module.css";
import { useGlobalStore } from "../../store/globalStore";

const CategoryChart = ({ title, data }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const currencySymbol = useGlobalStore((state) => state.currencySymbol) || '';
  const axisStroke = isDark ? "#e2e8f0" : "#475569";
  const tickFill = isDark ? "#f1f5f9" : "#334155";
  const xTickFill = isDark ? "#f1f5f9" : "#2d3748";
  const gridStroke = isDark ? "#475569" : "#cbd5e1";
  const tooltipBg = isDark ? "#1e293b" : "#ffffff";
  const tooltipBorder = isDark ? "#475569" : "#cbd5e1";
  const tooltipText = isDark ? "#f1f5f9" : "#334155";
  const barColor = isDark ? "#90caf9" : "#1976d2";

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.graphTitle}>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />

          <XAxis
            dataKey="category"
            tick={{
              fontSize: 10,
              fill: xTickFill,
              fontWeight: 500,
            }}
            angle={-40}
            textAnchor="end"
            interval={0}
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
            labelStyle={{ color: tooltipText, fontWeight: "bold" }}
            itemStyle={{ color: barColor }}
            formatter={(value) => `${currencySymbol}${value}`}
          />

          <Bar dataKey="value" fill={barColor} barSize={40}>
            <LabelList
              dataKey="value"
              position="top"
              style={{ fill: tickFill, fontSize: 10, fontWeight: 600 }}
              formatter={(value) => `${currencySymbol}${value}`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
