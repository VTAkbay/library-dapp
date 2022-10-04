import BookComponent from "../components/BookComponent";
import { useParams } from "react-router-dom";

export default function Book() {
  let { bookId }: any = useParams();

  return <BookComponent bookId={bookId} />;
}
