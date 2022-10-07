import React from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Typography,
  useMediaQuery,
} from "@mui/material";
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
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [data, setData] = React.useState<interfaces.BookInterface>();
  const [contractRead, setContractRead] = React.useState(false);
  const { isConnected, isConnecting, isReconnecting, address } = useAccount();

  console.log("data", data);

  // Create get a book for the book page function

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
      } catch {
        setError(true);
        setErrorMessage("Error fetching books.");
      }

      setLoading(false);
    }
  }, [books]);

  React.useEffect(() => {
    if (address && !isConnecting && !isReconnecting && bookIsbns) {
      setContractRead(true);
    }
  }, [address, isConnecting, isReconnecting, bookIsbns]);

  return (
    <>
      {(isConnecting || isReconnecting || loading) && <Loader />}

      {!isConnecting && !isReconnecting && !isConnected && !loading && (
        <div>Please connect wallet.</div>
      )}

      {!isConnecting && !isReconnecting && isConnected && !loading && (
        <Container
          maxWidth="lg"
          sx={{
            marginTop: "2rem",
            marginBottom: "2rem",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ textAlign: "center" }}>
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
