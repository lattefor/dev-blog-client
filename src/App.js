import Header from "./components/header";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import AddNewBlog from "./pages/add-blog";
import Detail from "./pages/detail";
import SignInPage from "./pages/sign-in";
import SignUpPage from "./pages/sign-up";
import ProtectedRoute from "./components/ProtectedRoute";
import useLocalStorage from "./useLocalStorage";
import { useEffect } from "react";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";

function App() {
  const [theme, setTheme] = useLocalStorage("theme", "dark");

  // Apply theme to document body
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="dark-light-mode" data-theme={theme}>
      <div className="container">
        <div className="header-container">
          <Header />

          <button
            className="moon-sun-toggle"
            onClick={() => {
              setTheme((the) => (the === "dark" ? "light" : "dark"));
            }}
          >
            <span className="theme-icon">
              {theme === "dark" ? (
                <IoMoonOutline size={22} />
              ) : (
                <IoSunnyOutline size={22} />
              )}
            </span>
          </button>
        </div>

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/add-blog" element={
            <ProtectedRoute>
              <AddNewBlog />
            </ProtectedRoute>
          } />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="/blog/:id" element={<Detail />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;