import Header from "./components/header";
import Footer from "./components/footer";
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
import { ToastProvider } from "./context/ToastContext";

function App() {
  const [theme, setTheme] = useLocalStorage("theme", "dark");

  // Apply theme to document body
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ToastProvider>
      <div className="dark-light-mode" data-theme={theme}>
      <div className="container">
        <div className="header-container">
          <Header />

          <div
            className="moon-sun-toggle"
            onClick={() =>
              setTheme((the) => (the === "dark" ? "light" : "dark"))
            }
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setTheme((the) => (the === "dark" ? "light" : "dark"));
              }
            }}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <span className="theme-icon">
              {theme === "dark" ? (
                <IoMoonOutline />
              ) : (
                <IoSunnyOutline />
              )}
            </span>
          </div>
        </div>

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route
            exact
            path="/add-blog"
            element={
              <ProtectedRoute>
                <AddNewBlog />
              </ProtectedRoute>
            }
          />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="/blog/:id" element={<Detail />} />
        </Routes>

        <Footer />
      </div>
    </div>
    </ToastProvider>
  );
}

export default App;
