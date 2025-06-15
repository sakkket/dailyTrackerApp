import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { useTheme } from "@mui/material/styles";
import styles from "./CustomPieGraph.module.css";

const CustomPieGraph = ({ title, data }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const tooltipBg = isDark ? "#1e293b" : "#ffffff";
  const tooltipBorder = isDark ? "#475569" : "#cbd5e1";
  const labelColor = isDark ? "#f1f5f9" : "#334155";
  const itemColor = isDark ? "#e2e8f0" : "#1e293b";
  const legendColor = isDark ? "#e2e8f0" : "#475569";
  const titleColor = isDark ? "#e2e8f0" : "#1e293b";

  const COLORS = isDark
    ? [
        "#4b0082", "#006400", "#b8860b", "#8b0000", "#008b8b",
        "#556b2f", "#2f4f4f", "#483d8b", "#800000", "#2e8b57",
        "#5f9ea0", "#6b8e23", "#7b68ee", "#a52a2a", "#4682b4",
      ]
    : [
        "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1",
        "#a4de6c", "#d0ed57", "#a28fd0", "#f49ac2", "#b0c4de",
        "#f4a460", "#ff7f50", "#7fc97f", "#beaed4", "#fdc086",
      ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    if (percent * 100 < 10) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontSize: 12 }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
   <div className={styles.chartContainer}>
      <h3 className={styles.graphTitle}>{title}</h3>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: 12,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
            }}
            labelStyle={{ color: labelColor, fontWeight: "bold" }}
            itemStyle={{ color: itemColor }}
          />
          <Legend
            wrapperStyle={{
              fontSize: 14,
              color: legendColor,
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
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieGraph;
