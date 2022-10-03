import React from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";

declare module namespace {
  export interface Copy {
    id: string;
  }

  export interface Book {
    id: string;
    isbn: string;
    title: string;
    authorFirstName: string;
    authorLastName: string;
    copies: Copy[];
  }

  export interface RootObject {
    books: Book[];
    total: string;
  }
}

export default function BookComponent() {
  const isMobile = useMediaQuery("(max-width:899px)");
  const [loading, setLoading] = React.useState(true);

  const [books, setBooks] = React.useState<namespace.RootObject>();

  React.useEffect(() => {
    axios
      .get("http://localhost:3001/books")
      .then(function (response) {
        // handle success
        console.log(response.data);

        setBooks(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }, []);

  console.log(books);

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
          <Stack
            direction="column"
            spacing={3}
            sx={{
              alignItems: "center",
            }}
          >
            {books?.books.length === 0 ? (
              <div>No books</div>
            ) : (
              books?.books.map((book) => {
                return (
                  <Card
                    key={book.id}
                    variant="outlined"
                    sx={{ width: isMobile ? "70vw" : "50vw" }}
                  >
                    <CardActionArea component={Link} to={`/story/${book.id}`}>
                      <CardMedia
                        component="img"
                        height={isMobile ? "80" : "150"}
                        image={"https://picsum.photos/1920/1080"}
                        alt="story image"
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
                      {/* <ShareButton storyId={story.id} /> */}
                    </CardActions>
                  </Card>
                );
              })
            )}
          </Stack>
        </Container>
      )}
    </>
  );
}
