import "./App.css";
import "@rainbow-me/rainbowkit/styles.css";

import { HashRouter, Route, Routes } from "react-router-dom";
import { chains, ganacheChain } from "./lib/wagmi";

import Book from "./pages/Book";
import Books from "./pages/Books";
import Header from "./components/Header";
import Home from "./pages/Home";
import MyBooks from "./pages/MyBooks";
import NotFound from "./pages/404";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain } from "wagmi";
import { isDev } from "./lib/utils";

function App() {
  return (
    <HashRouter>
      <RainbowKitProvider
        coolMode
        chains={chains}
        initialChain={isDev ? ganacheChain : chain.goerli}
        showRecentTransactions={true}
      >
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="books" element={<Books />} />
          <Route path="my-books" element={<MyBooks />} />
          <Route path="book/:bookIsbn" element={<Book />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </RainbowKitProvider>
    </HashRouter>
  );
}

export default App;
