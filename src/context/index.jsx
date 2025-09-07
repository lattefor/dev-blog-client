import { useState, createContext } from "react";

export const GlobalContext = createContext(null);

export default function GlobalStates({ children }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "Unknown",
    userId: "",
  });

  const [blogList, setBlogList] = useState([]);
  const [pending, setPending] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [sortOption, setSortOption] = useState(() => {
    return sessionStorage.getItem("blogSortOption") || "newest";
  });

  return (
    <GlobalContext.Provider
      value={{
        formData,
        setFormData,
        blogList,
        setBlogList,
        pending, 
        setPending,
        isEdit,
        setIsEdit,
        sortOption,
        setSortOption,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
