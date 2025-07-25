import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  NavLink,
  useLocation,
} from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  AppBar,
  CssBaseline,
  Button,
  Divider,
  ListSubheader,
  Tooltip,
  useTheme,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { FaMoneyBill, FaTint, FaSignOutAlt, FaListAlt } from "react-icons/fa";
import PaymentsIcon from '@mui/icons-material/Payments';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { IoMdSettings } from "react-icons/io";
import InsightsIcon from '@mui/icons-material/Insights';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AssessmentIcon from '@mui/icons-material/Assessment';
import Login from "./Login";
import Signup from "./Signup";
import Logout from "./Logout";
import MainApp from "./MainApp";
import Calories from "./CaloriesTracker/Calories";
import WaterTracker from "./trackers/WaterTracker";
import ProfileSettings from "./Pages/ProfileSettings";
import ExpenditureReports from "./Pages/Report";
import { validateToken, getUniqueVisit } from "./API/APIService";
import TransactionTable from "./components/TransactionTable";
import FeedbackForm from "./Pages/Feedback";
import RateReviewIcon from '@mui/icons-material/RateReview';
import RaspberryPiInfo from "./Pages/RaspberryPiInfo";
function Expenditure() {
  return <Typography variant="h6">Expenditure Page</Typography>;
}

const drawerWidth = 240;

function HeaderTitle() {
  const location = useLocation();
  const pathTitleMap = {
    "/": "Expense Summary",
    "/transactions": "Transactions",
    "/waterTracker": "Water Intake",
    "/calories": "Calories Tracker",
    "/expenditure": "Expenditure",
    "/profileSettings": "Profile",
    "/reports": "Reports",
    "/feedback": "Feedback",
    "/info": "System Info"
  };
  const title = pathTitleMap[location.pathname] || "Expenses";
  return (
    <Typography variant="h6" noWrap component="div">
      {title}
    </Typography>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "true"? true:false);
  const [uniqueUserCount, setUniqueUserCount] = useState(0);
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  useEffect(() => {
    async function autoLogin() {
      const userName = localStorage.getItem("userName");
      try {
        await validateToken();
        if (userName) setUser(userName);
      } catch {
        handleLogout();
      }
    }
    autoLogin();

    getUniqueVisit()
    .then((res)=>{
       setUniqueUserCount(res.count);
    })
    .catch(err => {})
  }, []);

  function handleLogin(name) {
    setUser(name);
    setUniqueUserCount(localStorage.getItem("uniqueUser"))
  }

  function handleProfileChange(user) {
    if(user && user.name) {
      setUser(user.name);
    }
  }

  function handleSignup(name) {
    setUser(name);
  }

  function handleLogout() {
    setUser(null);
    localStorage.clear();
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleThemeChange = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("theme",!darkMode)
  }

  const subheaderSx = {
    color: "#4f46e5",
    fontWeight: "bold",
    fontSize: "0.85rem",
    lineHeight: "2.5",
    bgcolor: "transparent",
  };

  const subheaderDarkSx = {
    color: "white",
    fontWeight: "bold",
    fontSize: "1rem",
    lineHeight: "2.5",
    bgcolor: "transparent",
  };

  const drawer = (
    <Box
      sx={{
        p: 2,
        color: "#111827",
        height: "100%",
        ...(!darkMode && {
          backgroundColor: "#e0e7ff",
        }),
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography
          variant="h6"
          sx={{
            ...(darkMode && {
              color: "white",
            }),
          }}
        >
          {!collapsed && user && `👋 Welcome, ${user}`}
        </Typography>
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{ display: { xs: "none", sm: "inline-flex" } }}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      <Divider sx={{ my: 2 }} />
      <List
        subheader={
          !collapsed && (
            <ListSubheader component="div" sx={darkMode ? subheaderDarkSx: subheaderSx}>
              Finance
            </ListSubheader>
          )
        }
      >
        <Tooltip
          title="Insights"
          placement="right"
          disableHoverListener={!collapsed}
        >
          <ListItem button component={NavLink} to="/">
            <ListItemIcon>
              <InsightsIcon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Insights"
                sx={{
                  ...(darkMode && {
                    color: "white",
                  }),
                }}
              />
            )}
          </ListItem>
        </Tooltip>
        <Tooltip
          title="Transactions"
          placement="right"
          disableHoverListener={!collapsed}
        >
          <ListItem button component={NavLink} to="/transactions">
            <ListItemIcon>
              <ListAltIcon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Transactions"
                sx={{
                  ...(darkMode && {
                    color: "white",
                  }),
                }}
              />
            )}
          </ListItem>
        </Tooltip>
        <Tooltip
          title="Reports"
          placement="right"
          disableHoverListener={!collapsed}
        >
          <ListItem button component={NavLink} to="/reports">
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Reports"
                sx={{
                  ...(darkMode && {
                    color: "white",
                  }),
                }}
              />
            )}
          </ListItem>
        </Tooltip>
      </List>
      {/* <Divider sx={{ my: 2 }} />
      <List
        subheader={
          !collapsed && (
            <ListSubheader component="div" sx={!darkMode ? subheaderSx : {}}>
              Health
            </ListSubheader>
          )
        }
      >
        <Tooltip
          title="Water Intake"
          placement="right"
          disableHoverListener={!collapsed}
        >
          <ListItem button component={NavLink} to="/waterTracker">
            <ListItemIcon>
              <FaTint />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Water Intake" />}
          </ListItem>
        </Tooltip>
      </List> */}
       <Divider sx={{ my: 2 }} />
      <List
        subheader={
          !collapsed && (
            <ListSubheader component="div" sx={darkMode ? subheaderDarkSx: subheaderSx}>
              Settings
            </ListSubheader>
          )
        }
      >
        <Tooltip
          title="Profile"
          placement="right"
          disableHoverListener={!collapsed}
        >
          <ListItem button component={NavLink} to="/profileSettings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            {!collapsed && <ListItemText  sx={{
                  ...(darkMode && {
                    color: "white",
                  }),
                }} primary="Profile" />}
          </ListItem>
        </Tooltip>
      </List>
       <List>
        <Tooltip
          title="Feedback"
          placement="right"
          disableHoverListener={!collapsed}
        >
          <ListItem button component={NavLink} to="/feedback">
            <ListItemIcon>
              <RateReviewIcon />
            </ListItemIcon>
            {!collapsed && <ListItemText  sx={{
                  ...(darkMode && {
                    color: "white",
                  }),
                }} primary="Feedback" />}
          </ListItem>
        </Tooltip>
      </List>
      <List>
        <ListItem>
          <Button
            variant="outlined"
            color="error"
            startIcon={<FaSignOutAlt />}
            onClick={handleLogout}
            fullWidth
          >
            {!collapsed && "Logout"}
          </Button>
        </ListItem>
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ textAlign: "center", px: 1, fontSize: "0.75rem", color: darkMode ? "#aaa" : "#333" }}>
        Unique Visits: {uniqueUserCount}
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          {user && (
            <AppBar
              position="fixed"
              sx={{
                width: { sm: `calc(100% - ${collapsed ? 72 : drawerWidth}px)` },
                ml: { sm: `${collapsed ? 72 : drawerWidth}px` },
                background: "linear-gradient(135deg, #3b82f6, #9333ea)",
              }}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: "none" } }}
                >
                  <MenuIcon />
                </IconButton>
                <HeaderTitle />
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  sx={{ ml: 1 }}
                  onClick={handleThemeChange}
                  color="inherit"
                >
                  {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Toolbar>
            </AppBar>
          )}

          {user && (
            <Box
              component="nav"
              sx={{
                width: { sm: collapsed ? 72 : drawerWidth },
                flexShrink: { sm: 0 },
              }}
              aria-label="sidebar"
            >
              <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                  display: { xs: "block", sm: "none" },
                  "& .MuiDrawer-paper": { width: drawerWidth },
                }}
              >
                {drawer}
              </Drawer>
              <Drawer
                variant="permanent"
                sx={{
                  display: { xs: "none", sm: "block" },
                  "& .MuiDrawer-paper": {
                    width: collapsed ? 72 : drawerWidth,
                    transition: "width 0.3s",
                    overflowX: "hidden",
                    color: "#111827",
                    boxSizing: "border-box",
                    ...(!darkMode && {
                      backgroundColor: "#e0e7ff",
                    }),
                  },
                }}
                open
              >
                {drawer}
              </Drawer>
            </Box>
          )}

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${collapsed ? 72 : drawerWidth}px)` },
            }}
          >
            {user && <Toolbar />}
            <Routes>
              <Route
                path="/"
                element={user ? <MainApp /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/calories"
                element={user ? <Calories /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/login"
                element={
                  !user ? (
                    <Login onLogin={handleLogin} />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/signup"
                element={
                  !user ? (
                    <Signup onSignup={handleSignup} />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/logout"
                element={
                  user ? (
                    <Logout onLogout={handleLogout} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/waterTracker"
                element={
                  user ? <WaterTracker /> : <Navigate to="/login" replace />
                }
              />
               <Route
                path="/profileSettings"
                element={
                  user ? <ProfileSettings onProfileChange={handleProfileChange}/> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/transactions"
                element={
                  user ? <TransactionTable /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/reports"
                element={
                  user ? <ExpenditureReports /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/feedback"
                element={
                  user ? <FeedbackForm /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/info"
                element={
                  <RaspberryPiInfo />
                }
              />
              <Route path="/expenditure" element={<Expenditure />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Box>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          theme="colored"
          limit={2}
        />
      </Router>
    </ThemeProvider>
  );
}
