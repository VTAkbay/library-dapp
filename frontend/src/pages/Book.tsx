import BookComponent from "../components/BookComponent";
import { useParams } from "react-router-dom";

export default function Book() {
  let { bookIsbn } = useParams();

  return <BookComponent bookIsbn={bookIsbn} />;
}
