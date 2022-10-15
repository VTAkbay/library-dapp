import axios from "axios";
import ABI from "../library-abi.json";

export const contractInterface = ABI;

export const contractAdress = "0x0F22364A367e3690952C9fc90944b9F215F1cc65";

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
