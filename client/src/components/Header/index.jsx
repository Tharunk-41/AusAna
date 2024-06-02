import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

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
    <AppBar position="static">
      <Toolbar style={{ justifyContent: "space-between", backgroundColor: "white" }}>
          <Box
            component="img"
            src="/logo.png"
            alt="Austere Analytics Logo"
            sx={{
              height: 50,
            }}
          />
        {token && (
          <div style={{ border: '1px solid black' }}>
            <Button
              startIcon={<AccountCircle />}
              aria-controls="menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
              sx={{ backgroundColor: 'white', color: '#54C1DF' }}
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
  );
};

export default Header;
