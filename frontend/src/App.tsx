import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import NotFound from "./pages/404";
import Book from "./pages/Book";
import Books from "./pages/Books";
import Home from "./pages/Home";
import MyBooks from "./pages/MyBooks";
import {
  // darkTheme,
  // lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { chain } from "wagmi";
import { chains } from "./lib/wagmi";

function App() {
  return (
    <HashRouter>
      <RainbowKitProvider
        coolMode
        // theme={theme.palette.mode === "dark" ? darkTheme() : lightTheme()}
        chains={chains}
        initialChain={chain.goerli}
        showRecentTransactions={true}
      >
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="books" element={<Books />} />
          <Route path="my-books" element={<MyBooks />} />
          <Route path="book/:bookId" element={<Book />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </RainbowKitProvider>
    </HashRouter>
  );
}

export default App;
