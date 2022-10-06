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

  function getBooks() {
    axios
      .get("http://localhost:3001/books")
      .then(function (response) {
        setData(response.data);
      })
      .catch(function (error) {
        setError(true);
        setErrorMessage("Error fetching books.");
      })
      .then(function () {
        setLoading(false);
      });
  }

  function getABook() {
    axios
      .get("http://localhost:3001/books")
      .then(function (response) {
        setData({
          books: [response.data.books[0]],
          total: "1",
        });
      })
      .catch(function (error) {
        setError(true);
        setErrorMessage("Error fetching books.");
      })
      .then(function () {
        setLoading(false);
      });
  }

  React.useEffect(() => {
    if (bookId) {
      getABook();
    } else {
      getBooks();
    }
  }, [bookId]);

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <Container
          maxWidth="md"
          sx={{
            marginTop: "2rem",
            marginBottom: "2rem",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ textAlign: "center" }}>
            {error && <div>{error && errorMessage}</div>}
            {(data?.books?.length === 0 || !data) && !error && (
              <div>No books</div>
            )}
          </Typography>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
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
                          component="div"
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
