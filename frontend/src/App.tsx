import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Books from "./pages/Books";
import Home from "./pages/Home";
import MyBooks from "./pages/MyBooks";

function App() {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="books" element={<Books />} />
        <Route path="my-books" element={<MyBooks />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </HashRouter>
  );
}

export default App;
