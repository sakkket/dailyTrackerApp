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
  Chip,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import {
  fetchTransactions,
  deleteTransactionById,
  updateTransaction,
} from "../API/APIService";
import { EXPENDITURE_CATEGORIES_MAP } from "../helpers/constants";
import MonthYearPicker from "./Calendar/MonthYearPicker";
import { EXPENDITURE_CATEGORIES } from "../helpers/constants";
import { toast } from "react-toastify";
import { useGlobalStore } from "../store/globalStore";

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
};

const getComparator = (order, orderBy) =>
  order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);

const sortRows = (array, comparator) => {
  const stabilized = array.map((el, index) => [el, index]);
  stabilized.sort((a, b) => {
    const cmp = comparator(a[0], b[0]);
    return cmp !== 0 ? cmp : a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
};

export default function TransactionTable() {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editingId, setEditingId] = useState(null);
  const [amountEdit, setAmountEdit] = useState("");
  const [commentEdit, setCommentEdit] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedMonth, setMonth] = useState(moment().format("YYYY-MM"));
  const [pageCount, setPageCount] = useState(0);
  const currencySymbol = useGlobalStore((state) => state.currencySymbol);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchTransactionsList(selectedMonth, categoryFilter, rowsPerPage, page);
  }, []);

  const fetchTransactionsList = async (month, category = "", limit, offset) => {
    try {
      category = category === "all" ? "" : category;
      const res = await fetchTransactions(month, category, limit, offset);
      if (res && res.transactions.length) {
        setPageCount(res.totalCount);
        const transactions = res.transactions.map((tx) => ({
          ...tx,
          category: EXPENDITURE_CATEGORIES_MAP[tx.category],
        }));
        setRows(transactions);
      } else {
        setRows([]);
        setPage(0);
        setPageCount(0);
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

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
    fetchTransactionsList(
      selectedMonth,
      "",
      rowsPerPage,
      newPage * rowsPerPage
    );
  };

  const handleMonthChange = (month) => {
    setMonth(month);
    fetchTransactionsList(
      month,
      categoryFilter,
      rowsPerPage,
      page * rowsPerPage
    );
  };
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const startEdit = (row) => {
    setEditingId(row._id);
    setAmountEdit(row.amount);
    setCommentEdit(row.comment);
  };

  const saveEdit = (id) => {
    if (id && amountEdit && amountEdit !== "0") {
      updateTransaction(id, { amount: parseInt(amountEdit), comment: commentEdit })
        .then((res) => {
          if(res && !res.error){
             setEditingId(null);
          toast.success("Updated Successfully");
          fetchTransactionsList(
            selectedMonth,
            categoryFilter,
            rowsPerPage,
            page * rowsPerPage
          );
          } else{
            toast.error("Update Failed");
          }
        })
        .catch((error) => toast.error("Failed to update"));
    }
  };

  const deleteRow = (id) => {
    deleteTransactionById(id)
      .then((resp) => {
        fetchTransactionsList(
          selectedMonth,
          categoryFilter,
          rowsPerPage,
          page * rowsPerPage
        );
        toast.success("Deleted Successfully");
      })
      .catch((error) => toast.error("Failed to delete"));
  };

  const handleCategoryFilter = (e) => {
    const category = e.target.value;
    setCategoryFilter(category);
    fetchTransactionsList(selectedMonth, category, rowsPerPage);
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

  const uniqueCategories = [
    {
      key: "all",
      label: "All",
    },
    ...EXPENDITURE_CATEGORIES,
  ];

  const renderMobileCards = () => (
    <Box>
      {rows.map((row) => (
        <Paper
          key={row._id}
          elevation={3}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <strong>{moment(row.day).format("Do MMMM YYYY")}</strong>
            <Chip
              label={row.type}
              color={
                row.type === "SAVING" ||
                row.type === "CREDIT" ||
                row.type === "SAVINGS"
                  ? "success"
                  : "error"
              }
              size="small"
              onClick={() => {}}
            />
          </Box>
          <Box mt={1}>
            <Box fontWeight={600} color="primary.main">
              {row.category}
            </Box>
            <div>
              Amount:{" "}
              {editingId === row._id ? (
                <TextField
                  type="number"
                  size="small"
                  value={amountEdit}
                  onChange={(e) => setAmountEdit(e.target.value)}
                  sx={{
                    input: {
                      color: "text.primary",
                      backgroundColor: "background.paper",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "divider",
                      },
                    },
                  }}
                />
              ) : (
                <strong>{currencySymbol + row.amount}</strong>
              )}
            </div>
            {row.comment ? (
              <div>
              Comment:
              {editingId === row._id ? (
                <TextField
                  type="text"
                  size="small"
                  value={commentEdit}
                  onChange={(e) => setCommentEdit(e.target.value)}
                  sx={{
                    input: {
                      color: "text.primary",
                      backgroundColor: "background.paper",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "divider",
                      },
                    },
                  }}
                />
              ) : (
               <strong>{' '+ row.comment}</strong>
              )}
            </div>
            ) : (
              ""
            )}
          </Box>
          <Box mt={1} display="flex" gap={1}>
            {editingId === row._id ? (
              <Tooltip title="Save" arrow>
                <IconButton onClick={() => saveEdit(row._id)} color="primary">
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Edit" arrow>
                <IconButton onClick={() => startEdit(row)} color="secondary">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Delete" arrow>
              <IconButton onClick={() => deleteRow(row._id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      ))}
    </Box>
  );

  const renderDesktopTable = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {["date", "category", "type", "amount", "comment"].map((column) => (
              <TableCell key={column}>
                {/* <TableSortLabel
                  active={orderBy === column}
                  direction={orderBy === column ? order : "asc"}
                  onClick={() => handleRequestSort(column)}
                >
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                </TableSortLabel> */}
                <strong>
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                </strong>
              </TableCell>
            ))}
            <TableCell>
              <strong>Actions</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row._id}>
              <TableCell>{moment(row.day).format("Do MMMM YYYY")}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>
                <Chip
                  label={row.type}
                  color={
                    row.type === "SAVING" ||
                    row.type === "CREDIT" ||
                    row.type === "SAVINGS"
                      ? "success"
                      : "error"
                  }
                  size="small"
                  onClick={() => {}}
                />
              </TableCell>
              <TableCell>
                {editingId === row._id ? (
                  <TextField
                    type="number"
                    size="small"
                    value={amountEdit}
                    onChange={(e) => setAmountEdit(e.target.value)}
                    sx={{
                      input: {
                        color: "text.primary",
                        backgroundColor: "background.paper",
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "divider",
                        },
                      },
                    }}
                  />
                ) : (
                  `${currencySymbol + row.amount}`
                )}
              </TableCell>
                   <TableCell>
                {editingId === row._id ? (
                  <TextField
                    type="text"
                    size="small"
                    value={commentEdit}
                    onChange={(e) => setCommentEdit(e.target.value)}
                    sx={{
                      input: {
                        color: "text.primary",
                        backgroundColor: "background.paper",
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "divider",
                        },
                      },
                    }}
                  />
                ) : (
                  `${row.comment}`
                )}
              </TableCell>
              <TableCell>
                {editingId === row._id ? (
                  <Tooltip title="Save" arrow>
                    <IconButton
                      onClick={() => saveEdit(row._id)}
                      color="primary"
                    >
                      <SaveIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Edit" arrow>
                    <IconButton
                      onClick={() => startEdit(row)}
                      color="secondary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Delete" arrow>
                  <IconButton onClick={() => deleteRow(row._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Paper sx={{ width: "100%", minHeight: "40vh", overflow: "hidden", p: 2 }}>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
        mb={2}
      >
        <MonthYearPicker onMonthChange={handleMonthChange} />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Filter by Category"
            onChange={handleCategoryFilter}
          >
            {uniqueCategories.map((cat) => (
              <MenuItem key={cat.key} value={cat.key}>
                {cat.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {isMobile ? renderMobileCards() : renderDesktopTable()}

      <TablePagination
        rowsPerPage={rowsPerPage}
        component="div"
        count={pageCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[]}
      />
    </Paper>
  );
}
