import * as Yup from "yup";

import {
  Alert,
  Box,
  Button,
  IconButton,
  LinearProgress,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import { LoadingButton } from "@mui/lab";
import Modal from "@mui/material/Modal";
import React from "react";
import { libraryContract } from "../lib/utils";
import { useContractWrite } from "wagmi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50vw",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

interface CreateBookModalProps {
  open: boolean;
  handleClose: () => void;
}

type UserSubmitForm = {
  title: string;
  authorFirstName: string;
  authorLastName: string;
  isbn: string;
};

export default function CreateBookModal({
  open,
  handleClose,
}: CreateBookModalProps) {
  const [adding, setAdding] = React.useState(false);
  const [addingError, setAddingError] = React.useState(false);
  const [addingErrorMessage, setAddingErrorMessage] = React.useState("");
  const [confirming, setConfirming] = React.useState(false);

  const handleErrorBar = () => {
    setAddingError(false);
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("*required")
      .min(5, "Title must be at least 5 characters"),
    authorFirstName: Yup.string()
      .required("*required")
      .min(2, "Author First Name must be at least 2 characters"),
    authorLastName: Yup.string()
      .required("*required")
      .min(2, "Author Last Name must be at least 2 characters"),
    isbn: Yup.string()
      .required("*required")
      .min(10, "Isbn must be at least 10 characters"),
  });

  const { writeAsync } = useContractWrite({
    mode: "recklesslyUnprepared",
    ...libraryContract,
    functionName: "addBook",
    async onSettled(data, error) {
      if (data) {
        setConfirming(true);
        handleClose();
        setAdding(false);

        const transaction = await data?.wait();

        if (transaction.confirmations >= 1) {
          setConfirming(false);
        }
      }

      if (error?.name && error.message) {
        setConfirming(false);
        setAdding(false);
        setAddingError(true);
        setAddingErrorMessage(error.message);
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSubmitForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (formData: UserSubmitForm) => {
    setAdding(true);

    writeAsync({
      recklesslySetUnpreparedArgs: [
        formData.title,
        formData.authorFirstName,
        formData.authorLastName,
        formData.isbn,
      ],
    });
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-book-modal-title"
        aria-describedby="create-book-modal-description"
      >
        <Box
          sx={style}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          noValidate
        >
          <Box sx={{ width: "100%", height: "5px", marginBottom: "1rem" }}>
            {adding && <LinearProgress color="inherit" />}
          </Box>

          <Stack
            direction="column"
            // spacing={0}
            sx={{
              alignItems: "center",
            }}
          >
            <Typography variant="h6" component="h2">
              Add book to library
            </Typography>

            <Box
              sx={{
                width: "70%",
              }}
            >
              <TextField
                label="Title"
                maxRows={1}
                sx={{
                  width: "100%",
                  color: "#374151",
                  appearance: "none",
                }}
                variant="standard"
                {...register("title")}
              />
              <Typography
                sx={{
                  color: "#EF4444",
                  fontSize: "0.75rem",
                  width: "100%",
                  height: "10px",
                  marginTop: "5px",
                }}
              >
                {errors.title?.message}
              </Typography>
            </Box>

            <Box
              sx={{
                width: "70%",
              }}
            >
              <TextField
                label="Author First Name"
                maxRows={1}
                sx={{
                  width: "100%",
                  color: "#374151",
                  appearance: "none",
                }}
                variant="standard"
                {...register("authorFirstName")}
              />
              <Typography
                sx={{
                  color: "#EF4444",
                  fontSize: "0.75rem",
                  width: "100%",
                  height: "10px",
                  marginTop: "5px",
                }}
              >
                {errors.authorFirstName?.message}
              </Typography>
            </Box>

            <Box
              sx={{
                width: "70%",
              }}
            >
              <TextField
                label="Author Last Name"
                maxRows={1}
                sx={{
                  width: "100%",
                  color: "#374151",
                  appearance: "none",
                }}
                variant="standard"
                {...register("authorLastName")}
              />
              <Typography
                sx={{
                  color: "#EF4444",
                  fontSize: "0.75rem",
                  width: "100%",
                  height: "10px",
                  marginTop: "5px",
                }}
              >
                {errors.authorLastName?.message}
              </Typography>
            </Box>

            <Box
              sx={{
                width: "70%",
              }}
            >
              <TextField
                label="Isbn"
                maxRows={1}
                sx={{
                  width: "100%",
                  color: "#374151",
                  appearance: "none",
                }}
                variant="standard"
                {...register("isbn")}
              />
              <Typography
                sx={{
                  color: "#EF4444",
                  fontSize: "0.75rem",
                  width: "100%",
                  height: "10px",
                  marginTop: "5px",
                }}
              >
                {errors.isbn?.message}
              </Typography>
            </Box>

            <LoadingButton
              endIcon={<LibraryAddIcon />}
              type="submit"
              variant="outlined"
              loadingPosition="end"
              loading={adding}
            >
              Add
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>

      <Snackbar
        open={addingError}
        autoHideDuration={10000}
        onClose={handleErrorBar}
      >
        <Alert
          action={
            <>
              <Button
                onClick={handleErrorBar}
                type="submit"
                color="inherit"
                size="small"
              >
                Retry
              </Button>
              <IconButton
                sx={{ marginLeft: "1rem", padding: "4px" }}
                aria-label="delete"
                onClick={handleErrorBar}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
          severity="warning"
          sx={{ width: "100%" }}
        >
          {addingErrorMessage}!
        </Alert>
      </Snackbar>

      <Snackbar open={confirming}>
        <Alert severity="success" sx={{ width: "100%" }}>
          Confirming the transaction, please wait!
        </Alert>
      </Snackbar>
    </>
  );
}
