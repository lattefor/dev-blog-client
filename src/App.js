import logo from "./logo.svg";
import Header from "./components/header";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import AddNewBlog from "./pages/add-blog";
import Contact from "./pages/contact";
import Detail from "./pages/detail";
import useLocalStorage from "./useLocalStorage";
import { useEffect } from "react";

function App() {
  const [theme, setTheme] = useLocalStorage("theme", "dark");
  
  // Apply theme to document body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);
  
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
          <Route path="/blog/:id" element={<Detail />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;