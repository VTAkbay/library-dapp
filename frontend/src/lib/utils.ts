import ABI from "../library-abi.json";
import axios from "axios";

export const isDev =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export const contractInterface = ABI;

export const contractAddress = isDev
  ? "0xc718A64528bA2ab86c01e5D3B881aEB9Ce8135A5" // Ganache
  : "0x1029b7182b99A1b0Aa58d598974d601651b78504"; // Goerli

export const openInNewTab = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

export async function mockImg() {
  return await axios.get("https://picsum.photos/1920/1080").then((res) => {
    return res.request.responseURL;
  });
}

export const libraryContract = {
  addressOrName: contractAddress,
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
