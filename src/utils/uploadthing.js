import { generateReactHelpers } from "@uploadthing/react";

export const { useUploadThing } = generateReactHelpers({
  url: process.env.REACT_APP_API_BASE_URL ? 
    `${process.env.REACT_APP_API_BASE_URL.replace('/api/blogs/', '')}/api/uploadthing` : 
    "http://localhost:5011/api/uploadthing"
});