// src/Drawer/Drawer.tsx
import React, { useEffect } from "react";
import { useNavigate, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MuiDrawer, { DrawerProps as MuiDrawerProps } from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import LogoutIcon from "@mui/icons-material/Logout";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// Your content pages (JSX components)
import Sublist from "../components/Sublist";
import Doubts from "../components/Doubts";
import AddQuestion from "../components/FacultyPage";
import History from "../components/History";
import MapFaculty from "../components/AdminPage";
import History2 from "../components/History2";
import AddTaskIcon from "@mui/icons-material/AddTask";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import Answers from "../components/Answers";
const drawerWidth = 240;

// Mixin helpers

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});
const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

// Drawer header to push content below AppBar
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

// Extend AppBar with an optional `open` prop
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// Extend Drawer with optional `open` prop
interface CustomDrawerProps extends MuiDrawerProps {
  open?: boolean;
}
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<CustomDrawerProps>(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open
    ? { ...openedMixin(theme), "& .MuiDrawer-paper": openedMixin(theme) }
    : { ...closedMixin(theme), "& .MuiDrawer-paper": closedMixin(theme) }),
}));

interface MiniDrawerProps {
  role: "student" | "faculty" | "admin";
}
const MiniDrawer: React.FC<MiniDrawerProps> = ({ role }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = {
    student: [
      {
        text: "Subject List",
        path: "sublist",
        icon: <ContentPasteSearchIcon />,
      },
      { text: "Doubts", path: "student", icon: <BorderColorIcon /> },
    ],
    faculty: [
      { text: "Doubts", path: "doubts", icon: <EditDocumentIcon /> },
      { text: "Add Question", path: "faculty", icon: <CloudUploadIcon /> },
      {
        text: "Questions-Added",
        path: "Faculty_history",
        icon: <AccessTimeIcon />,
      },
    ],
    admin: [
      { text: "History", path: "history", icon: <AccessTimeIcon /> },
      { text: "Map Faculty", path: "admin", icon: <GroupAddIcon /> },
    ],
  } as const;

  // Function to check if a menu item is active
  const isActive = (path: string) => {
    return location.pathname === `/drawer/${path}`;
  };

  // Open / close drawer
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // On mount, redirect to the first item for this role
  useEffect(() => {
    const first = menuItems[role]?.[0]?.path;
    const currentpath = location.pathname;
    if (first && !currentpath.includes(`/drawer/`))
      navigate(`/drawer/${first}`);
  }, [role, navigate, location.pathname]);
  const usrname = localStorage.getItem("username");
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {/* {role.toUpperCase()} Discourse */}
            BIT Discourse
          </Typography>
          <Typography
            variant="h6"
            noWrap
            sx={{ marginLeft: "auto", display: "flex", alignItems: "center" }}
          >
            <AccountCircleIcon sx={{ mr: 1 }} /> {usrname}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          {menuItems[role].map(({ text, path, icon }) => {
            const active = isActive(path);
            return (
              <ListItem
                key={text}
                disablePadding
                sx={{
                  display: "block",
                  color: "black",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
                onClick={() => navigate(`/drawer/${path}`)}
              >
              <ListItemButton
  sx={{
    minHeight: 48,
    justifyContent: open ? "initial" : "center",
    px: 2.5,
    backgroundColor: active ? "#f5f5f5" : "transparent",  // active background also light gray
    "&:hover": {
      backgroundColor: "#f5f5f5", // hover always light gray
    },
  }}
>
  <ListItemIcon
    sx={{
      minWidth: 0,
      justifyContent: "center",
      color: active ? theme.palette.primary.main : "black",
      mr: open ? 3 : "auto",
    }}
  >
    {icon}
  </ListItemIcon>
  <ListItemText 
    primary={text} 
    sx={{ 
      opacity: open ? 1 : 0,
      color: active ? theme.palette.primary.main : "inherit" 
    }} 
  />
</ListItemButton>


              </ListItem>
            );
          })}
        </List>

        <Divider />

        <List>
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={handleLogout}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  color: "black",
                  justifyContent: "center",
                  mr: open ? 3 : "auto",
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Routes>
          {role === "student" && (
            <>
              <Route path="sublist" element={<Sublist />} />
              <Route path="student" element={<Doubts />} />
              <Route path="answer" element={<Answers />} />
            </>
          )}
          {role === "faculty" && (
            <>
              <Route path="doubts" element={<Doubts />} />
              <Route path="faculty" element={<AddQuestion />} />
              <Route path="Faculty_history" element={<History2 />} />
            </>
          )}
          {role === "admin" && (
            <>
              <Route path="history" element={<History />} />
              <Route path="admin" element={<MapFaculty />} />
            </>
          )}
          <Route
            path="*"
            element={
              <Navigate to={`/drawer/${menuItems[role][0].path}`} replace />
            }
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default MiniDrawer;