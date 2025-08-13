import { useContext, useEffect, useState, useCallback } from "react";
import classes from "./styles.module.css";
import { GlobalContext } from "../../context";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useToast } from "../../context/ToastContext";

export default function AddNewBlog() {
  const { formData, setFormData, setIsEdit, isEdit } =
    useContext(GlobalContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  

  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const { showToast } = useToast();
  
  // Cloudinary upload function
  const handleImageUpload = () => {
    setUploadInProgress(true);
    
    // Create Cloudinary upload widget
    window.cloudinary.openUploadWidget({
      cloudName: 'ddwt3aqgs', // Replace with your Cloudinary cloud name
      uploadPreset: 'devlogs', // You'll need to create this in Cloudinary
      sources: ['local', 'url', 'camera'],
      multiple: false,
      maxFiles: 1,
      resourceType: 'image',
    }, (error, result) => {
      setUploadInProgress(false);
      
      if (error) {
        console.error('Upload error:', error);
        showToast('Upload failed', 'error');
        return;
      }
      
      if (result.event === 'success') {
        const imageUrl = result.info.secure_url;
        console.log('Image uploaded:', imageUrl);
        setFormData(prev => ({
          ...prev,
          imageUrl: imageUrl,
        }));
        showToast('✅ Image uploaded successfully!', 'success');
      }
    });
  };
  
  // Reset form when navigating directly to the page
  useEffect(() => {
    // If we don't have state in the location, we're creating a new blog
    if (!location.state) {
      setIsEdit(false);
      setFormData({
        title: "",
        description: "",
        author: isSignedIn ? (user.fullName || user.username || user.emailAddresses[0]?.emailAddress || 'Unknown') : 'Unknown',
        userId: isSignedIn ? user.id : '',
        imageUrl: '',
      });
    }
  }, [location.pathname, setFormData, setIsEdit, isSignedIn, user]);

  const handleSaveBlogToDatabase = useCallback(async () => {
    if (isSubmitting) return;
    
    // Don't allow publish if upload is still in progress
    if (uploadInProgress) {
      showToast('Please wait for image upload to complete', 'info');
      return;
    }
    
    console.log('Publish button clicked.');
    console.log('📊 Current formData state:', formData);
    
    try {
      setIsSubmitting(true);
      
      let imageUrl = formData.imageUrl;
      
      // Image should already be uploaded when files were dropped
      // The imageUrl will be set by the upload callback
      
      console.log('Using imageUrl:', imageUrl);
      
      const blogData = {
        title: formData.title,
        description: formData.description,
        author: isSignedIn ? (user.fullName || user.username || user.emailAddresses[0]?.emailAddress || 'Unknown') : 'Unknown',
        imageUrl: imageUrl
      };
      
      console.log('Blog data being sent to server:', blogData);
      
      // Get authentication token
      const token = await getToken();
      
      // Set up headers with authentication token
      const headers = {
        Authorization: `Bearer ${token}`
      };
      
      const response = isEdit
        ? await axios.put(
            `${process.env.REACT_APP_API_BASE_URL}update/${location.state.getCurrentBlogItem._id}`,
            {
              title: formData.title,
              description: formData.description,
              author: isSignedIn ? (user.fullName || user.username || user.emailAddresses[0]?.emailAddress || 'Unknown') : 'Unknown',
              imageUrl: imageUrl
              // userId is now extracted from the token on the server
            },
            { headers }
          )
        : await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}add`, 
            blogData,
            { headers }
          );

      const result = await response.data;
      if (result) {
        setIsEdit(false);
        setFormData({
          title: "",
          description: "",
          author: isSignedIn ? (user.fullName || user.username || user.emailAddresses[0]?.emailAddress || 'Unknown') : 'Unknown',
          userId: isSignedIn ? user.id : '',
          imageUrl: '',
        });
        // Files no longer needed with Cloudinary
        // Delay navigation slightly to allow upload callbacks to complete
        setTimeout(() => {
          navigate("/");
        }, 500);
      }
    } catch (error) {
      console.error("Error saving blog:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isEdit, location, navigate, setFormData, setIsEdit, isSubmitting, isSignedIn, user, getToken, showToast, uploadInProgress]);

  useEffect(() => {
    if (location.state) {
      const { getCurrentBlogItem } = location.state;
      setIsEdit(true);
      setFormData({
        title: getCurrentBlogItem.title,
        description: getCurrentBlogItem.description,
        author: getCurrentBlogItem.author || 'Unknown',
        userId: getCurrentBlogItem.userId || '',
        imageUrl: getCurrentBlogItem.imageUrl || '',
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
        
        <div className={classes.formGroup}>
          <Label>Blog Image</Label>
          <div style={{
            border: '2px dashed #ccc',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            minHeight: '100px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Button 
              type="button"
              onClick={handleImageUpload}
              disabled={uploadInProgress}
              variant="outline"
            >
              {uploadInProgress ? 'Uploading...' : 'Upload Image'}
            </Button>
            {formData.imageUrl && (
              <p style={{ marginTop: '10px', color: 'green' }}>✅ Image uploaded</p>
            )}
          </div>
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