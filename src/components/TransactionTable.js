import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TablePagination,
  IconButton,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { Chip } from "@mui/material";
import moment from "moment";
import { fetchTransactions } from "../API/APIService";
import { EXPENDITURE_CATEGORIES_MAP } from "../helpers/constants";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const sortRows = (array, comparator) => {
  const stabilized = array.map((el, index) => [el, index]);
  stabilized.sort((a, b) => {
    const cmp = comparator(a[0], b[0]);
    return cmp !== 0 ? cmp : a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
};

const TransactionTable = () => {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editingId, setEditingId] = useState(null);
  const [amountEdit, setAmountEdit] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedMonth, setMonth] = useState(moment().format("YYYY-MM"));
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Fetch transactions from the API
  useEffect(() => {
    fetchTransactionsList(selectedMonth);
  }, []);

  const fetchTransactionsList = async (month) => {
    try {
      const transactions = await fetchTransactions(month);
      if (transactions && transactions.length) {
        transactions.forEach((element) => {
          element.category = EXPENDITURE_CATEGORIES_MAP[element.category];
        });
        setRows(transactions);
        //setTotalCount(20);
      } else {
        setRows([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setAmountEdit(row.amount);
  };

  const saveEdit = (id) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, amount: parseFloat(amountEdit) } : row
    );
    setRows(updatedRows);
    setEditingId(null);
  };

  const deleteRow = (id) => {
    const updated = rows.filter((row) => row.id !== id);
    setRows(updated);
  };

  const handleCategoryFilter = (event) => {
    setCategoryFilter(event.target.value);
    setPage(0);
  };

  const filteredRows =
    categoryFilter === "All"
      ? rows
      : rows.filter((row) => row.category === categoryFilter);

  const visibleRows = sortRows(
    filteredRows,
    getComparator(order, orderBy)
  ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const uniqueCategories = ["All", ...new Set(rows.map((row) => row.category))];

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ p: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            views={["year", "month"]}
            label="Select Month"
            minDate={new Date("2000-01-01")}
            maxDate={new Date("2060-12-31")}
            value={selectedDate}
            onChange={(newValue) => {
              setSelectedDate(newValue);
              setPage(0); // optional: reset pagination
            }}
            renderInput={(params) => (
              <TextField {...params} size="small" sx={{ minWidth: 200 }} />
            )}
          />
        </LocalizationProvider>
      </Box>

      <Box sx={{ p: 2 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Filter by Category"
            onChange={handleCategoryFilter}
          >
            {uniqueCategories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {["date", "category", "type", "amount"].map((column) => (
                <TableCell key={column}>
                  <TableSortLabel
                    active={orderBy === column}
                    direction={orderBy === column ? order : "asc"}
                    onClick={() => handleRequestSort(column)}
                  >
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.day}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>
                  <Chip
                    label={row.type}
                    color={
                      row.type === "SAVING" || row.type === "CREDIT"
                        ? "success"
                        : "error"
                    }
                    variant="outlined"
                    size="small"
                    onClick={() => {}}
                  />
                </TableCell>

                <TableCell>
                  {editingId === row.id ? (
                    <TextField
                      type="number"
                      size="small"
                      value={amountEdit}
                      onChange={(e) => setAmountEdit(e.target.value)}
                    />
                  ) : (
                    row.amount
                  )}
                </TableCell>
                <TableCell>
                  {editingId === row.id ? (
                    <IconButton
                      onClick={() => saveEdit(row.id)}
                      color="primary"
                    >
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() => startEdit(row)}
                      color="secondary"
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  <IconButton onClick={() => deleteRow(row.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 10, 10]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TransactionTable;
