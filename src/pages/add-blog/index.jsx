import { useContext, useEffect, useState, useCallback } from "react";
import classes from "./styles.module.css";
import { GlobalContext } from "../../context";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";

export default function AddNewBlog() {
  const { formData, setFormData, setIsEdit, isEdit } =
    useContext(GlobalContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form when navigating directly to the page
  useEffect(() => {
    // If we don't have state in the location, we're creating a new blog
    if (!location.state) {
      setIsEdit(false);
      setFormData({
        title: "",
        description: "",
      });
    }
  }, [location.pathname, setFormData, setIsEdit]);

  const handleSaveBlogToDatabase = useCallback(async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      const response = isEdit
        ? await axios.put(
            `${process.env.REACT_APP_API_BASE_URL}update/${location.state.getCurrentBlogItem._id}`,
            {
              title: formData.title,
              description: formData.description,
            }
          )
        : await axios.post(`${process.env.REACT_APP_API_BASE_URL}add`, {
            title: formData.title,
            description: formData.description,
          });

      const result = await response.data;
      if (result) {
        setIsEdit(false);
        setFormData({
          title: "",
          description: "",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Error saving blog:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isEdit, location, navigate, setFormData, setIsEdit, isSubmitting]);

  useEffect(() => {
    if (location.state) {
      const { getCurrentBlogItem } = location.state;
      setIsEdit(true);
      setFormData({
        title: getCurrentBlogItem.title,
        description: getCurrentBlogItem.description,
      });
    }
  }, [location.state, setFormData, setIsEdit]);

  return (
    <div className={classes.wrapper}>
      <h1>{isEdit ? "Edit Blog" : "Create New Blog"}</h1>
      <div className={classes.formWrapper}>
        <div className={classes.formGroup}>
          <Label htmlFor="title">Blog Title</Label>
          <Input
            name="title"
            placeholder="Enter a descriptive title"
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
          />
        </div>
        
        <div className={classes.formGroup}>
          <Label htmlFor="description">Blog Content</Label>
          <Textarea
            name="description"
            placeholder="Write your blog content here..."
            id="description"
            value={formData.description}
            onChange={(event) =>
              setFormData({
                ...formData,
                description: event.target.value,
              })
            }
            rows={8}
          />
        </div>
        
        <div className={classes.buttonContainer}>
          <Button 
            onClick={handleSaveBlogToDatabase}
            disabled={isSubmitting}
            variant="default"
            size="lg"
            style={{ width: '100%' }}
          >
            {isSubmitting ? "Saving..." : isEdit ? "Update Blog" : "Publish Blog"}
          </Button>
        </div>
      </div>
    </div>
  );
}