import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import classes from "./styles.module.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import { GlobalContext } from "../../context";

export default function Detail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setBlogList } = useContext(GlobalContext);
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchBlogDetail() {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5011/api/blogs/detail/${id}`);
                setBlog(response.data);
            } catch (err) {
                console.error("Error fetching blog details:", err);
                setError("Failed to load blog details");
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchBlogDetail();
        }
    }, [id]);

    async function handleEdit(blogItem) {
        navigate("/add-blog", { state: { getCurrentBlogItem: blogItem } });
    }
    
    async function handleDeleteBlog(blogId) {
        try {
            const response = await axios.delete(`http://localhost:5011/api/blogs/delete/${blogId}`);
            const result = response.data;

            if (result?.message) {
                // Navigate back to home page after successful deletion
                navigate("/");
            }
        } catch (error) {
            console.error("Error while deleting blog:", error);
        }
    }

    if (loading) return <div className={classes.wrapper}><p>Loading...</p></div>;
    if (error) return <div className={classes.wrapper}><p>Error: {error}</p></div>;
    if (!blog) return <div className={classes.wrapper}><p>Blog not found</p></div>;

    return (
        <div className={classes.wrapper}>
            <h1>{blog.title}</h1>
            <div className={classes.metadata}>
                <p>Posted: {new Date(blog.date).toLocaleDateString()}</p>
                {blog.author && <p>Author: {blog.author}</p>}
            </div>
            <div className={classes.content}>
                <p>{blog.description}</p>
            </div>
            <div className={classes.actions}>
                <FaEdit onClick={() => handleEdit(blog)} size={22} />
                <FaTrash onClick={() => handleDeleteBlog(blog._id)} size={22} />
            </div>
        </div>
    );
}