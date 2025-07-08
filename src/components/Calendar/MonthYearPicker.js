import React, { useState, useEffect, useRef } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { Box, Button, MenuItem, Select, Typography, useTheme, Paper } from "@mui/material";
import moment from "moment";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MonthYearPicker = ({ onMonthChange }) => {
  const theme = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [selectedMonthYear, setSelectedMonthYear] = useState(moment().format("YYYY-MM").toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const pickerRef = useRef(null);

  const years = Array.from({ length: 10 }, (_, i) => selectedYear - 5 + i);

  const handleSelection = (monthIndex) => {
    const monthValue = `${selectedYear}-${String(monthIndex + 1).padStart(2, "0")}`;
    setSelectedMonthYear(monthValue);
    setShowPicker(false);
    onMonthChange(monthValue);
  };

  const handleClickOutside = (e) => {
    if (pickerRef.current && !pickerRef.current.contains(e.target)) {
      setShowPicker(false);
    }
  };

  useEffect(() => {
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  return (
    <Box ref={pickerRef} sx={{ position: "relative", display: "inline-block" }}>
      <Button
        variant="outlined"
        startIcon={<FaRegCalendarAlt />}
        onClick={() => setShowPicker(!showPicker)}
        sx={{
          color: theme.palette.text.primary,
          borderColor: theme.palette.divider,
          backgroundColor: theme.palette.background.paper,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        {selectedMonthYear}
      </Button>

      {showPicker && (
        <Paper
          elevation={4}
          sx={{
            position: "absolute",
            top: "110%",
            left: 0,
            zIndex: 10,
            p: 2,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            width: 250,
          }}
        >
          <Select
            fullWidth
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            size="small"
            sx={{ mb: 2 }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
            }}
          >
            {months.map((month, index) => (
              <Button
                key={month}
                onClick={() => handleSelection(index)}
                variant="contained"
                sx={{
                  fontSize: "0.75rem",
                  textTransform: "none",
                  padding: "6px",
                  backgroundColor: theme.palette.mode === "dark" ? "#334155" : "#e2e8f0",
                  color: theme.palette.text.primary,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  },
                }}
              >
                {month}
              </Button>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default MonthYearPicker;
