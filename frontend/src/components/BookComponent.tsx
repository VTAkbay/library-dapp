import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Alert,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Typography,
  useMediaQuery,
  Box,
  Snackbar,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Unstable_Grid2";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import ShareButton from "./ShareButton";
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractInfiniteReads,
  paginatedIndexesConfig,
  useContractWrite,
} from "wagmi";
import {
  contractAdress,
  contractInterface,
  libraryContract,
} from "../lib/utils";

declare module interfaces {
  export interface Copy {
    id: string;
  }

  export interface Book {
    isValid: boolean;
    owner: string;
    isbn: string;
    title: string;
    authorFirstName: string;
    authorLastName: string;
    copies?: Copy[];
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
  const [openRemoveBookDialog, setOpenRemoveBookDialog] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);
  const [removing, setRemoving] = React.useState(false);
  const [removingError, setRemovingError] = React.useState(false);
  const [removingErrorMessage, setRemovingErrorMessage] = React.useState("");

  const { data: bookIsbnsLength } = useContractRead({
    addressOrName: contractAdress,
    contractInterface: contractInterface,
    functionName: "getBookIsbnsLength",
    enabled: contractRead,
  });

  const { data: bookIsbns } = useContractInfiniteReads({
    cacheKey: "library-dapp",
    ...paginatedIndexesConfig(
      (index) => ({
        ...libraryContract,
        functionName: "bookIsbns",
        args: [index],
      }),
      {
        start: 0,
        perPage: Number(bookIsbnsLength?._hex),
        direction: "increment",
      }
    ),
    enabled: Boolean(bookIsbnsLength),
  });

  const { data: books } = useContractReads({
    contracts: bookIsbns!.pages[0].map((book: any) => ({
      addressOrName: contractAdress,
      contractInterface: contractInterface,
      functionName: "bookByIsbn",
      args: [book],
    })),
    enabled: Boolean(bookIsbns),
  });

  React.useEffect(() => {
    if (books) {
      try {
        if (bookIsbn) {
          setData({
            books: books
              ?.map((book) => ({
                isValid: book._isValid,
                owner: book._owner,
                isbn: book._isbn,
                title: book._title,
                authorFirstName: book._authorFirstName,
                authorLastName: book._authorLastName,
              }))
              .filter((book) => book.isbn === bookIsbn),
            total: books.filter((book) => book._isbn === bookIsbn).length,
          });
        } else {
          setData({
            books: books?.map((book) => ({
              isValid: book._isValid,
              owner: book._owner,
              isbn: book._isbn,
              title: book._title,
              authorFirstName: book._authorFirstName,
              authorLastName: book._authorLastName,
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
  }, [books, bookIsbn]);

  React.useEffect(() => {
    if (address && !isConnecting && !isReconnecting && bookIsbns) {
      setContractRead(true);
    }
  }, [address, isConnecting, isReconnecting, bookIsbns]);

  const { writeAsync: removeBookWrite } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: contractAdress,
    contractInterface: contractInterface,
    functionName: "removeBook",
    args: removeBookIsbn,
    async onSettled(data, error) {
      if (data) {
        setRemoving(true);

        const transaction = await data?.wait();

        if (transaction.confirmations >= 1) {
          setConfirming(true);
          setOpenRemoveBookDialog(false);
        }
      }

      if (error?.name && error.message) {
        setOpenRemoveBookDialog(false);
        setRemovingError(true);
        setRemovingErrorMessage(error.message);
      }

      setRemoving(false);
    },
  });

  async function removeBook(book: interfaces.Book) {
    if (address === book.owner) {
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
              <DialogContentText id="alert-dialog-description">
                This action is irreversible and completely remove the book. If
                there are copies of the book, the contract will give an error.
                Do you want to delete the copies and then remove the book?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <LoadingButton
                onClick={handleClickRemoveBookDialog}
                endIcon={<DeleteForeverIcon />}
                loadingPosition="end"
                loading={removing}
              >
                Delete copies and remove book
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
              Removing the book, please wait
            </Alert>
          </Snackbar>

          <Typography sx={{ textAlign: "center" }} component={"span"}>
            {error && <div>{error && errorMessage}</div>}
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
                  {address === book.owner && (
                    <IconButton
                      aria-label="delete"
                      size="large"
                      onClick={() => {
                        removeBook(book);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                  <Card variant="outlined">
                    <CardActionArea component={Link} to={`/book/${book.isbn}`}>
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
