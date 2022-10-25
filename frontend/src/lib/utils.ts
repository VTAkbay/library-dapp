import ABI from "../library-abi.json";
import axios from "axios";

export const contractInterface = ABI;

export const contractAdress = "0x584d49fF828fFC24c9beEAb6A36d0e98cB05Feda";

export const openInNewTab = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

export async function mockImg() {
  return await axios.get("https://picsum.photos/1920/1080").then((res) => {
    return res.request.responseURL;
  });
}

export const isDev =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export const libraryContract = {
  addressOrName: contractAdress,
  contractInterface: contractInterface,
};

export const headerPages = [
  { key: 0, title: "Books", route: "books" },
  { key: 1, title: "My Books", route: "my-books" },
];

export declare module interfaces {
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
