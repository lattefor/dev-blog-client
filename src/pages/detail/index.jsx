import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import classes from "./styles.module.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import { GlobalContext } from "../../context";
import { Card, CardActions } from "../../components/card";
import { useUser, useAuth } from "@clerk/clerk-react";

export default function Detail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { blogList, setBlogList } = useContext(GlobalContext);
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isSignedIn, user } = useUser();
    const { getToken } = useAuth();
    
    // Track mouse position for gradient effect
    const handleMouseMove = (e) => {
        const wrapper = e.currentTarget;
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        wrapper.style.setProperty('--mouse-x', `${x}px`);
        wrapper.style.setProperty('--mouse-y', `${y}px`);
    };

    useEffect(() => {
        async function fetchBlogDetail() {
            try {
                setLoading(true);
                
                // First, check if we already have the blog in the blogList
                if (blogList && blogList.length > 0) {
                    const foundBlog = blogList.find(blog => blog._id === id);
                    if (foundBlog) {
                        console.log('Found blog in existing list:', foundBlog);
                        setBlog(foundBlog);
                        setLoading(false);
                        return;
                    }
                }
                
                // If not found in blogList, fetch from API
                const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5011/api/blogs/';
                const url = `${API_BASE_URL}detail/${id}`;
                console.log('Fetching blog details from:', url);
                const response = await axios.get(url);
                console.log('Blog data received:', response.data);
                setBlog(response.data);
            } catch (err) {
                console.error("Error fetching blog details:", err);
                
                // Try one more time with a direct ID fetch
                try {
                    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5011/api/blogs/';
                    // Try without the 'detail/' path segment
                    const url = `${API_BASE_URL}${id}`;
                    console.log('Trying alternative URL:', url);
                    const response = await axios.get(url);
                    if (response.data) {
                        setBlog(response.data);
                        return;
                    }
                } catch (secondErr) {
                    console.error("Second attempt failed:", secondErr);
                    setError("Failed to load blog details");
                }
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchBlogDetail();
        }
    }, [id, blogList]);

    async function handleEdit(blogItem) {
        if (!isSignedIn) {
            navigate("/sign-in", { state: { returnUrl: `/blog/${id}` } });
            return;
        }
        
        // Check if user is the author
        if (user && blogItem.userId !== user.id) {
            alert("You can only edit your own blogs");
            return;
        }
        
        navigate("/add-blog", { state: { getCurrentBlogItem: blogItem } });
    }
    
    async function handleDeleteBlog(blogId) {
        if (!isSignedIn) {
            navigate("/sign-in", { state: { returnUrl: `/blog/${id}` } });
            return;
        }
        
        // Check if user is the author
        if (user && blog.userId !== user.id) {
            alert("You can only delete your own blogs");
            return;
        }
        
        try {
            const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5011/api/blogs/';
            const token = await getToken();
            
            const response = await axios.delete(
                `${API_BASE_URL}delete/${blogId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const result = response.data;

            if (result?.message) {
                // Navigate back to home page after successful deletion
                navigate("/");
            }
        } catch (error) {
            console.error("Error while deleting blog:", error);
            if (error.response?.status === 403) {
                alert("You don't have permission to delete this blog");
            }
        }
    }

    if (loading) return <div className={classes.wrapper}><p>Loading...</p></div>;
    if (error) return <div className={classes.wrapper}><p>Error: {error}</p></div>;
    if (!blog) return <div className={classes.wrapper}><p>Blog not found</p></div>;

    return (
        <div 
            className={classes.wrapper}
            onMouseMove={handleMouseMove}
        >
            <h1>{blog.title}</h1>
            <div className={classes.metadata}>
                <div className={classes.metaInfo}>
                    <p>Posted: {new Date(blog.date).toLocaleDateString()}</p>
                    {blog.author && <p>Author: {blog.author}</p>}
                </div>
                {isSignedIn && user && blog.userId === user.id && (
                    <div className={classes.actionButtons}>
                        <FaEdit onClick={() => handleEdit(blog)} size={22} />
                        <FaTrash onClick={() => handleDeleteBlog(blog._id)} size={22} />
                    </div>
                )}
            </div>
            <div className={classes.content}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{blog.description}</div>
            </div>

        </div>
    );
}