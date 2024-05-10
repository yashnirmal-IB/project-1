import {
  AccountCircle,
  DarkMode,
  DensityMedium,
  WbSunny,
} from "@mui/icons-material";
import { Menu, MenuItem, IconButton, Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedUser } from "../state/slice/loggedUser";
import { setCustomers } from "../state/slice/customers";
import fetchCustomers from "../utils/fetchCustomers";
import { switchTheme } from "../state/slice/theme";

export default function Navbar() {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.value);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    fetchCustomers()
      .then((data) => {
        if (data.length === 0) {
          console.log("No data found");
        }
        dispatch(setCustomers(data));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [dispatch]);

  return (
    <div
      className={`h-[60px] flex justify-between items-center px-2 md:px-6 border-b ${
        theme === "dark" && "border-gray-600"
      }`}
    >
      <div className="flex items-center gap-2">
        <IconButton onClick={() => setIsDrawerOpen(true)} className="lg:hidden">
          <DensityMedium />
        </IconButton>
        <Link to="/" className="text-2xl font-bold">
          Company
        </Link>
        <Drawer
          open={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
          }}
          className="border-2 border-blue-600 flex flex-col"
        >
          <Sidebar />
        </Drawer>
      </div>

      <div className="flex items-center gap-6">
        <IconButton
          variant="outlined"
          onClick={() => {
            theme === "light"
              ? dispatch(switchTheme("dark"))
              : dispatch(switchTheme("light"));

            theme === "light"
              ? document.body.classList.add("dark-theme")
              : document.body.classList.remove("dark-theme");
          }}
        >
          {theme === "light" ? <WbSunny /> : <DarkMode />}
        </IconButton>
        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem
              onClick={() => {
                dispatch(setLoggedUser(""));
                navigate("/login");
                handleClose();
              }}
              className="text-red-400"
            >
              <p>Logout</p>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}
