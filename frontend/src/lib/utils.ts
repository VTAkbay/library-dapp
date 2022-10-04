import axios from "axios";

export const openInNewTab = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

export async function mockImg() {
  return await axios.get("https://picsum.photos/1920/1080").then((res) => {
    return res.request.responseURL;
  });
}
