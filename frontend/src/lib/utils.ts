import axios from "axios";
import ABI from "../library-abi.json";

export const contractInterface = ABI;

export const contractAdress = "0xad7B1F48b5755F600f4a9784DCa5B6787963E0F2";

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
