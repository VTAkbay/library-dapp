import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Snackbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  contractAdress,
  contractInterface,
  libraryContract,
} from "../lib/utils";
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
} from "wagmi";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import { LoadingButton } from "@mui/lab";
import React from "react";
import ShareButton from "./ShareButton";

declare module interfaces {
  export interface Copy {
    id: number;
    isbn: string;
    isValid: boolean;
    holder: string;
  }
  export interface Book {
    isValid: boolean;
    isbn: string;
    title: string;
    authorFirstName: string;
    authorLastName: string;
    copies: Copy[];
  }

  export interface BookInterface {
    books: Book[];
    total: number;
  }

  export interface BookComponentProps {
    bookIsbn?: string;
  }
}

export default function BookComponent({
  bookIsbn,
}: interfaces.BookComponentProps) {
  const isMobile = useMediaQuery("(max-width:899px)");
  const { isConnected, isConnecting, isReconnecting, address } = useAccount();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [data, setData] = React.useState<interfaces.BookInterface>();
  const [contractRead, setContractRead] = React.useState(false);
  const [removeBookIsbn, setRemoveBookIsbn] = React.useState("");
  const [addCopyIsbn, setAddCopyIsbn] = React.useState("");
  const [addingCopy, setAddingCopy] = React.useState(false);
  const isHasCopy = Boolean(
    data?.books.filter(
      (book) => book.isbn === removeBookIsbn && book.copies.length === 0
    ).length
  );
  const [openRemoveBookDialog, setOpenRemoveBookDialog] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);
  const [removing, setRemoving] = React.useState(false);
  const [removingError, setRemovingError] = React.useState(false);
  const [removingErrorMessage, setRemovingErrorMessage] = React.useState("");

  const { data: owner } = useContractRead({
    ...libraryContract,
    functionName: "owner",
    enabled: contractRead,
  });

  const { data: bookIsbnsLength } = useContractRead({
    addressOrName: contractAdress,
    contractInterface: contractInterface,
    functionName: "getBookIsbnsLength",
    enabled: contractRead,
    watch: true,
  });

  const { data: bookIsbns } = useContractReads({
    contracts: bookIsbnsLength?._hex
      ? Array(Number(bookIsbnsLength._hex))
          .fill(0)
          .map((i, index) => ({
            addressOrName: contractAdress,
            contractInterface: contractInterface,
            functionName: "bookIsbns",
            args: [index],
          }))
      : [
          {
            addressOrName: contractAdress,
            contractInterface: contractInterface,
            functionName: "bookIsbns",
            args: [0],
          },
        ],
    enabled: Boolean(bookIsbnsLength?._hex),
    watch: true,
    allowFailure: true,
  });

  const { data: books } = useContractReads({
    contracts: bookIsbns
      ? bookIsbns.map((book) => ({
          addressOrName: contractAdress,
          contractInterface: contractInterface,
          functionName: "bookByIsbn",
          args: [book],
        }))
      : [
          {
            addressOrName: contractAdress,
            contractInterface: contractInterface,
            functionName: "bookByIsbn",
            args: [" "],
          },
        ],
    enabled: Boolean(bookIsbns),
    watch: true,
    allowFailure: true,
  });

  const { data: copyIdsOfBooks } = useContractReads({
    contracts: bookIsbns
      ? bookIsbns.map((book) => ({
          addressOrName: contractAdress,
          contractInterface: contractInterface,
          functionName: "getCopyIdsByIsbn",
          args: [book],
        }))
      : [
          {
            addressOrName: contractAdress,
            contractInterface: contractInterface,
            functionName: "getCopyIdsByIsbn",
            args: [" "],
          },
        ],
    enabled: Boolean(bookIsbns),
    watch: true,
    allowFailure: true,
  });

  const allCopyIds: Number[] = [];

  copyIdsOfBooks?.map((i) =>
    i.map((copy) => allCopyIds.push(Number(copy._hex)))
  );

  const { data: copies } = useContractReads({
    contracts: allCopyIds
      ? allCopyIds.map((id) => ({
          addressOrName: contractAdress,
          contractInterface: contractInterface,
          functionName: "copies",
          args: [id],
        }))
      : [
          {
            addressOrName: contractAdress,
            contractInterface: contractInterface,
            functionName: "copies",
            args: [" "],
          },
        ],
    enabled: Boolean(bookIsbns),
    watch: true,
    allowFailure: true,
  });

  React.useEffect(() => {
    if (address && !isConnecting && !isReconnecting) {
      if (Number(bookIsbnsLength?._hex) === 0) {
        setLoading(false);
        return;
      }

      if (books) {
        try {
          if (bookIsbn) {
            setData({
              books: books
                ?.map((book) => ({
                  isValid: book._isValid,
                  isbn: book._isbn,
                  title: book._title,
                  authorFirstName: book._authorFirstName,
                  authorLastName: book._authorLastName,
                  copies: copies
                    ? copies
                        .filter((copy) => copy._isbn === book._isbn)
                        .map((copy) => {
                          return {
                            id: Number(copy._id),
                            isbn: copy._isbn,
                            isValid: copy._isValid,
                            holder: copy._holder,
                          };
                        })
                    : [],
                }))
                .filter((book) => book.isbn === bookIsbn),
              total: books.filter((book) => book._isbn === bookIsbn).length,
            });
          } else {
            setData({
              books: books?.map((book) => ({
                isValid: book._isValid,
                isbn: book._isbn,
                title: book._title,
                authorFirstName: book._authorFirstName,
                authorLastName: book._authorLastName,
                copies: copies
                  ? copies
                      .filter((copy) => copy._isbn === book._isbn)
                      .map((copy) => {
                        return {
                          id: Number(copy._id),
                          isbn: copy._isbn,
                          isValid: copy._isValid,
                          holder: copy._holder,
                        };
                      })
                  : [],
              })),
              total: books.length,
            });
          }
        } catch {
          setError(true);
          setErrorMessage("Error fetching books.");
        }

        setLoading(false);
      }
    } else if (!address && !isConnecting && !isReconnecting) {
      setLoading(false);
    }
  }, [
    books,
    copies,
    bookIsbnsLength,
    bookIsbn,
    address,
    isConnecting,
    isReconnecting,
  ]);

  React.useEffect(() => {
    if (address && !isConnecting && !isReconnecting) {
      setContractRead(true);
    }
  }, [address, isConnecting, isReconnecting]);

  const { writeAsync: removeBookWrite } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: contractAdress,
    contractInterface: contractInterface,
    functionName: "removeBook",
    args: removeBookIsbn,
    async onSettled(data, error) {
      setRemoving(false);

      if (data) {
        setConfirming(true);
        setOpenRemoveBookDialog(false);

        const transaction = await data?.wait();

        if (transaction.confirmations >= 1) {
          setConfirming(false);
        }
      }

      if (error?.name && error.message) {
        if (!String(error).startsWith("Error: user rejected transaction")) {
          setOpenRemoveBookDialog(false);
          setRemovingError(true);
          setRemovingErrorMessage(error.message);
        }
      }
    },
    allowFailure: true,
  });

  async function removeBook(book: interfaces.Book) {
    if (address === owner) {
      setRemoveBookIsbn(book.isbn);
      setOpenRemoveBookDialog(true);
    }
  }

  const handleCloseRemoveBookDialog = () => {
    setOpenRemoveBookDialog(false);
  };

  const handleClickRemoveBookDialog = () => {
    setRemoving(true);
    removeBookWrite();
  };

  const handleErrorBar = () => {
    setRemovingError(false);
  };

  const { writeAsync: addCopyToBookWrite } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: contractAdress,
    contractInterface: contractInterface,
    functionName: "addCopy",
    args: addCopyIsbn,
    async onSettled(data, error) {
      if (data) {
        setAddingCopy(true);

        const transaction = await data?.wait();

        if (transaction.confirmations >= 1) {
          setAddingCopy(false);
          setAddCopyIsbn("");
        }
      }

      if (error?.name && error.message) {
        // error handling for add copy
      }

      setAddingCopy(false);
      setAddCopyIsbn("");
    },
  });

  const addCopyToBook = (book: interfaces.Book) => {
    setAddCopyIsbn(book.isbn);
  };

  return (
    <>
      {(isConnecting || isReconnecting || loading) && <Loader />}

      {!isConnecting && !isReconnecting && !isConnected && !loading && (
        <Box display="flex" justifyContent="center" marginTop="2rem">
          <ConnectButton
            chainStatus="none"
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        </Box>
      )}

      {!isConnecting && !isReconnecting && isConnected && !loading && (
        <Container
          maxWidth="lg"
          sx={{
            marginTop: "1rem",
            marginBottom: "1rem",
            justifyContent: "center",
          }}
        >
          <Dialog
            open={openRemoveBookDialog}
            onClose={handleCloseRemoveBookDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {` Do you want to remove book with the ${removeBookIsbn} isbn?`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText
                id="alert-dialog-description"
                sx={{ color: isHasCopy ? "" : "red" }}
              >
                {isHasCopy
                  ? "This action is irreversible and completely remove the book. Are you sure want to remove the book?"
                  : "Can not remove the book because there is copies of book, delete copies first."}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <LoadingButton
                onClick={handleClickRemoveBookDialog}
                endIcon={<DeleteForeverIcon />}
                loadingPosition="end"
                loading={removing}
                disabled={!isHasCopy}
                sx={{ color: "red" }}
              >
                {isHasCopy ? "Remove the book" : "Delete copies first"}
              </LoadingButton>
              <Button
                onClick={handleCloseRemoveBookDialog}
                variant="outlined"
                autoFocus
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={removingError}
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
              {removingErrorMessage}!
            </Alert>
          </Snackbar>

          <Snackbar open={confirming}>
            <Alert severity="success" sx={{ width: "100%" }}>
              Removing the book, please wait!
            </Alert>
          </Snackbar>

          <Dialog
            open={Boolean(addCopyIsbn)}
            onClose={() => {
              if (!addingCopy) setAddCopyIsbn("");
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {` Do you want to add a copy to book with the ${addCopyIsbn} isbn?`}
            </DialogTitle>
            <DialogActions>
              <LoadingButton
                onClick={() => {
                  addCopyToBookWrite();
                }}
                endIcon={<AddCircleIcon />}
                loadingPosition="end"
                loading={addingCopy}
                sx={{ color: "green" }}
              >
                {!addingCopy ? "Add" : "Adding copy please wait!"}
              </LoadingButton>
              <Button
                onClick={() => {
                  setAddCopyIsbn("");
                }}
                variant="outlined"
                autoFocus
                disabled={addingCopy}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          <Typography sx={{ textAlign: "center" }} component={"span"}>
            {error && !data?.books && <div>{error && errorMessage}</div>}
            {(data?.books?.length === 0 || !data) && !error && (
              <div>
                {bookIsbn ? `No book found with ${bookIsbn} isbn` : "No books"}
              </div>
            )}
          </Typography>
          <Grid
            container
            spacing={{ xs: 1, md: 2 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            justifyContent="center"
            alignItems="center"
          >
            {data?.books.map((book) => {
              return (
                <Grid xs={2} sm={4} md={4} key={book.isbn}>
                  <Card variant="outlined">
                    <CardActionArea component={Link} to={`/book/${book.isbn}`}>
                      {address === String(owner) && (
                        <IconButton
                          aria-label="delete"
                          onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            removeBook(book);
                          }}
                          sx={{
                            margin: "0.5rem",
                            position: "absolute",
                          }}
                        >
                          <DeleteIcon
                            sx={{ color: "red", fontSize: "1.8rem" }}
                          />
                        </IconButton>
                      )}

                      {address === String(owner) && (
                        <IconButton
                          aria-label="add-copy"
                          onClick={(event) => {
                            addCopyToBook(book);
                            event.stopPropagation();
                            event.preventDefault();
                          }}
                          sx={{
                            margin: "0.5rem",
                            right: "0px",
                            position: "absolute",
                          }}
                        >
                          <AddCircleIcon
                            sx={{ color: "greenyellow", fontSize: "1.8rem" }}
                          />
                        </IconButton>
                      )}

                      <CardMedia
                        component="img"
                        height={isMobile ? "80" : "200"}
                        image={"https://picsum.photos/1920/1080"}
                        alt="book image"
                      />

                      <CardContent>
                        <Typography
                          gutterBottom
                          variant={isMobile ? "h6" : "h5"}
                        >
                          {book.title}
                        </Typography>
                        <Typography
                          variant={isMobile ? "body2" : "body1"}
                          color="text.secondary"
                        >
                          {book.isbn}
                        </Typography>
                        <Typography
                          variant={isMobile ? "body2" : "body1"}
                          color="text.secondary"
                        >
                          {book.authorFirstName + " " + book.authorLastName}
                        </Typography>
                        <Typography
                          variant={isMobile ? "body2" : "body1"}
                          color="text.secondary"
                        >
                          {"Total / Available copy: " +
                            (book.copies.length
                              ? book.copies.length +
                                "/" +
                                book.copies.filter(
                                  (copy) =>
                                    copy.holder ===
                                    "0x0000000000000000000000000000000000000000"
                                ).length
                              : "No Copy")}
                        </Typography>
                      </CardContent>
                    </CardActionArea>

                    <CardActions>
                      <ShareButton bookIsbn={book.isbn} />
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      )}
    </>
  );
}
