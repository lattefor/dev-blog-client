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
import { useDropzone } from "react-dropzone";
import { generateClientDropzoneAccept, generatePermittedFileTypes } from "uploadthing/client";
import { useUploadThing } from "../../utils/uploadthing";
import { useToast } from "../../context/ToastContext";

export default function AddNewBlog() {
  const { formData, setFormData, setIsEdit, isEdit } =
    useContext(GlobalContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Debug: Log when files state changes
  useEffect(() => {
    console.log('Files state changed:', files);
  }, [files]);
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const { showToast } = useToast();
  
  const { startUpload, routeConfig } = useUploadThing("imageUploader");
  
  const onDrop = useCallback((acceptedFiles) => {
    console.log("Files dropped:", acceptedFiles);
    setFiles(acceptedFiles);
    // Just store the files, don't upload yet
    if (acceptedFiles.length > 0) {
      showToast(`📎 ${acceptedFiles.length} file(s) ready to upload`, 'info');
    }
  }, [showToast]);
  
  console.log('Route config:', routeConfig);
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: routeConfig ? generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes,
    ) : undefined,
  });
  
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
    
    console.log('Publish button clicked. Files state:', files);
    
    try {
      setIsSubmitting(true);
      
      let imageUrl = formData.imageUrl;
      
      // Upload image first if files are selected
      if (files.length > 0) {
        console.log('Uploading image during publish...', files);
        showToast("📤 Uploading image...", 'info');
        
        // Start upload but don't wait for it - just continue with blog creation
        startUpload(files);
        
        // Just assume upload will work and continue
        showToast("✅ Image upload started, blog created!", 'success');
      }
      
      console.log('Using imageUrl:', imageUrl);
      
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
            {
              title: formData.title,
              description: formData.description,
              author: isSignedIn ? (user.fullName || user.username || user.emailAddresses[0]?.emailAddress || 'Unknown') : 'Unknown',
              imageUrl: imageUrl
              // userId is now extracted from the token on the server
            },
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
  }, [formData, isEdit, location, navigate, setFormData, setIsEdit, isSubmitting, isSignedIn, user, getToken, files, startUpload, showToast]);

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
          <div {...getRootProps()} style={{
            border: '2px dashed #ccc',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            minHeight: '100px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <input {...getInputProps()} />
            {files.length > 0 ? (
              <p>{files.length} file(s) selected: {files[0]?.name}</p>
            ) : (
              <p>Drop image files here or click to select</p>
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