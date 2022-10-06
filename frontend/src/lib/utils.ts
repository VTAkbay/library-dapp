import axios from "axios";
import ABI from "../library-abi.json";

export const contractInterface = ABI;

export const contractAdress = "0x51D903AB400053b60C1E32Dc6cd9Dba9FB1Ca604";

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
