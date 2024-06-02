import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import Navbar from "../Contents/Navbar";

const Header = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const nameFromStorage = localStorage.getItem("name");

    if (storedToken && nameFromStorage) {
      setToken(storedToken);
      setName(nameFromStorage);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    window.location.reload();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: "space-between", backgroundColor: "#54C1DF" ,marginBottom:"1px"}}>
          <Typography variant="h6">Austere Analytics</Typography>
          {token && (
            <div>
              <Button
                startIcon={<AccountCircle />}
                aria-controls="menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                {name}
              </Button>
              <Menu
                id="menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      {token && <Navbar />}
    </>
  );
};

export default Header;
