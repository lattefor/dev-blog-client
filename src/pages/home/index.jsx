import { useContext, useEffect, useState, useMemo } from "react";
import { GlobalContext } from "../../context";
import axios from "axios";
import classes from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import { SearchInput } from "../../components/ui/search-input";
import { ModernSelect } from "../../components/ui/modern-select";
import { useDebounce } from "../../hooks/useDebounce";
import { Card, CardContent, CardTitle, CardMeta, CardDescription } from "../../components/card";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  // Get sort option from sessionStorage or default to "newest"
  const [sortOption, setSortOption] = useState(() => {
    return sessionStorage.getItem("blogSortOption") || "newest";
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Track mouse position for gradient effect
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };
  
  const { blogList, setBlogList, pending, setPending } =
    useContext(GlobalContext);

  const navigate = useNavigate();

  async function fetchListOfBlogs() {
    try {
      setPending(true);
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

  useEffect(() => {
    fetchListOfBlogs();
  }, []);

  // Sort options for the dropdown
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "a-z", label: "Title (A-Z)" },
    { value: "z-a", label: "Title (Z-A)" },
  ];
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter blogs based on search term
  const filteredBlogs = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return blogList;
    }
    
    return blogList.filter(blog => 
      blog.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [blogList, debouncedSearchTerm]);
  
  // Sort filtered blogs based on selected sort option
  const sortedBlogs = useMemo(() => {
    if (!sortOption || !filteredBlogs.length) {
      return filteredBlogs;
    }
    
    // Create a new array to avoid mutating the original
    const blogs = [...filteredBlogs];
    
    switch (sortOption) {
      case 'newest':
        return blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'oldest':
        return blogs.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'a-z':
        return blogs.sort((a, b) => a.title.localeCompare(b.title));
      case 'z-a':
        return blogs.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return blogs;
    }
  }, [filteredBlogs, sortOption]);
  
  // Handle sort selection change
  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
    // Save to sessionStorage for persistence
    sessionStorage.setItem("blogSortOption", newSortOption);
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.controls}>
        <div className={classes.searchContainer}>
          <SearchInput 
            placeholder="Search blogs..." 
            value={searchTerm} 
            onChange={handleSearchChange} 
          />
        </div>
        <div className={classes.sortContainer}>
          <ModernSelect 
            options={sortOptions} 
            value={sortOption} 
            onChange={handleSortChange} 
            placeholder="Sort by" 
          />
        </div>
      </div>
      
      {pending ? (
        <p>Loading...</p>
      ) : sortedBlogs && sortedBlogs.length ? (
        <div className={classes.blogList}>
          {sortedBlogs.map((blogItem) => (
            <Card 
              key={blogItem._id}
              onMouseMove={handleMouseMove}
            >
              <CardContent onClick={() => navigate(`/blog/${blogItem._id}`)}>
                <CardTitle>{blogItem.title}</CardTitle>
                <CardMeta>Posted: {new Date(blogItem.date).toLocaleDateString()}</CardMeta>
                <CardDescription>
                  <p>{blogItem.description}</p>
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>No blogs found</p>
      )}
    </div>
  );
}