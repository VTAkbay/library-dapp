import * as React from "react";

import { headerPages, libraryContract } from "../lib/utils";
import { useAccount, useContractRead } from "wagmi";

import AdbIcon from "@mui/icons-material/Adb";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Container from "@mui/material/Container";
import CreateBookModal from "./CreateBookModal";
import IconButton from "@mui/material/IconButton";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { address } = useAccount();
  const navigate = useNavigate();

  const { data: owner } = useContractRead({
    ...libraryContract,
    functionName: "owner",
  });

  const [openCreateBookModal, setOpenCreateBookModal] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <CreateBookModal
          open={openCreateBookModal}
          handleClose={() => setOpenCreateBookModal(false)}
        />

        <Toolbar disableGutters>
          {/* Mobile */}
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => {
              navigate("/");
            }}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Library Dapp
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {headerPages.map((page) => (
                <MenuItem
                  key={page.key}
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(`/${page.route}`);
                  }}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* Normal */}
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            onClick={() => {
              navigate("/");
            }}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Library Dapp
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {headerPages.map((page) => (
              <Button
                key={page.key}
                onClick={() => {
                  handleCloseNavMenu();
                  navigate(`/${page.route}`);
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {address === owner && (
            <IconButton
              aria-label="add-book"
              sx={{ marginRight: "1rem" }}
              onClick={() => setOpenCreateBookModal(true)}
            >
              <LibraryAddIcon sx={{ color: "greenyellow" }} />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 0 }}>
            <ConnectButton
              chainStatus="none"
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full",
              }}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
