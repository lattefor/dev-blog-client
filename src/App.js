import logo from "./logo.svg";
import Header from "./components/header";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import AddNewBlog from "./pages/add-blog";
import Contact from "./pages/contact";
import useLocalStorage from "./useLocalStorage";

function App() {
  const [theme, setTheme] = useLocalStorage("theme", "dark");
  return (
    <div className="dark-light-mode" data-theme={theme}>
      <div className="container">
        <div className="header-container">
          <Header />
          <button
            onClick={() => {
              setTheme((the) => (the === "dark" ? "light" : "dark"));
            }}
          >
            {" "}
            Toggle Theme
          </button>
        </div>

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/add-blog" element={<AddNewBlog />} />
          <Route exact path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
