import { useContext, useEffect } from "react";
import { GlobalContext } from "../../context";
import axios from "axios";
import classes from "./styles.module.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { blogList, setBlogList, pending, setPending, isEdit, setIsEdit } =
    useContext(GlobalContext);

  const navigate = useNavigate();

  async function fetchListOfBlogs() {
    try {
      setPending(true);
      // To use environment variables in React:
      // 1. Create a file named .env in your project root
      // 2. Add REACT_APP_ prefix to your variables: REACT_APP_API_BASE_URL=http://localhost:5011/api/blogs/
      // 3. Restart your development server after creating/modifying .env
      // 4. Access using process.env.REACT_APP_API_BASE_URL
      // Note: Only variables prefixed with REACT_APP_ will be exposed to your application
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}`); 
      const results = response.data;

      if (results && Array.isArray(results)) {
        console.log("blogs received: ", results);
        setBlogList(results);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogList([]);
    } finally {
      setPending(false);
    }
  }

  // Functions moved to detail page

  useEffect(() => {
    fetchListOfBlogs();
  }, []);
  // The current code () => {fetchListOfBlogs} only passes the function reference but doesn't execute it
  // To actually call the function when the component mounts, we need to add the parentheses

  return (
    <div className={classes.wrapper}>
      <h1>Add Sort Here</h1>
      {pending ? (
        <p>Loading...</p>
      ) : blogList && blogList.length ? (
        <div className={classes.blogList}>
          {blogList.map((blogItem, index) => (
            <div key={blogItem._id} className={classes.container}>
              <div 
                className={classes.blogContent} 
                onClick={() => navigate(`/blog/${blogItem._id}`)}
              >
                <h2>{blogItem.title}</h2>
                <div className={classes.description}>
                  <p>{blogItem.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No blogs found</p>
      )}
    </div>
  );
}
