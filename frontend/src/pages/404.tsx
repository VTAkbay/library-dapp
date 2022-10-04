import { Box, Button, Container, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import logo from "../static/images/page-not-found.svg";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      component="main"
      sx={{
        alignItems: "center",
        display: "flex",
        flexGrow: 1,
        minHeight: "100%",
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        >
          <Typography align="center" variant="h2">
            404: The page you are looking for isn't here
          </Typography>
          <Typography align="center" variant="subtitle2">
            You either tried some shady route or you came here by mistake.
            Whichever it is, try using the navigation
          </Typography>
          <Box sx={{ textAlign: "center" }}>
            <img
              alt="Under development"
              src={logo}
              style={{
                marginTop: 50,
                display: "inline-block",
                maxWidth: "100%",
                width: 560,
              }}
            />
          </Box>
          <Box>
            <Button
              startIcon={<ArrowBackIcon fontSize="small" />}
              sx={{ mt: 3, mr: 3 }}
              variant="outlined"
              onClick={() => {
                navigate(-1);
              }}
            >
              Go Back
            </Button>
            <Button
              startIcon={<ArrowBackIcon fontSize="small" />}
              sx={{ mt: 3 }}
              variant="outlined"
              onClick={() => {
                navigate("/");
              }}
            >
              Go Homepage
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default NotFound;
