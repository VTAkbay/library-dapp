import { Tooltip, useTheme } from "@mui/material";

import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import ShareIcon from "@mui/icons-material/Share";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { openInNewTab } from "../lib/utils";

interface ShareButtonProps {
  bookIsbn: string;
}

export default function ShareButton({ bookIsbn }: ShareButtonProps) {
  const theme = useTheme();
  const baseUrl = `${window.location.host}%2Flibrary-dapp%2F%23%2Fbook/${bookIsbn}`;
  const copyUrl = `${window.location.host}/library-dapp/#/book/${bookIsbn}`;

  const actions = [
    {
      icon: <TwitterIcon />,
      name: "Twitter",
      function: () => {
        openInNewTab(
          `https://twitter.com/intent/tweet?url=${baseUrl}&text=You%20should%20check%20this%20book!`
        );
      },
    },
    {
      icon: <WhatsAppIcon />,
      name: "Whatsapp",
      function: () => {
        openInNewTab(
          `https://wa.me/?text=You%20should%20check%20this%20book!%20${baseUrl}`
        );
      },
    },
    {
      icon: <TelegramIcon />,
      name: "Telegram",
      function: () => {
        openInNewTab(
          `https://t.me/share/url?url=${baseUrl}&text=You%20should%20check%20this%20book!%20`
        );
      },
    },
    {
      icon: <FileCopyIcon />,
      name: "Copy",
      function: () => {
        navigator.clipboard.writeText(copyUrl);
      },
    },
  ];

  const actionStyles = {
    margin: 0,
    padding: 0,
    boxShadow: "none",
  };

  const ShareButtonStyles = {
    "& .MuiFab-primary": {
      backgroundColor:
        theme.palette.mode === "dark" ? "transparent" : "transparent",
      color: theme.palette.mode === "dark" ? "white" : "black",
      boxShadow: "none",
      width: 40,
      height: 40,
      margin: 0,
      marginLeft: 0,
      padding: 0,
      "& .MuiSpeedDialIcon-icon": { fontSize: 12 },
      "&:hover": {
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.2)"
            : "rgba(0, 0, 0, 0.2)",
      },
    },
  };
  return (
    <Tooltip title="Share book" placement="left">
      <SpeedDial
        ariaLabel="Share"
        icon={<ShareIcon />}
        direction={"right"}
        sx={ShareButtonStyles}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.function}
            sx={actionStyles}
          />
        ))}
      </SpeedDial>
    </Tooltip>
  );
}
