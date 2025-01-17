import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
const configureCloudinary = () => {
  const requiredEnvVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];

  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // Enable HTTPS
  });

  // Enable debug mode in development
  if (process.env.NODE_ENV !== 'production') {
    cloudinary.config().debug = true;
  }

  console.log('Cloudinary configured successfully');
};

const validateFile = (file) => {
  console.log('file ::: ',file)
  if (!file || !file.buffer) {
    throw new Error("Invalid file object");
  }
};

const uploadImageToCloudinary = async (file) => {
  try {
    configureCloudinary();
    validateFile(file);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("File uploaded successfully:", result);
            resolve(result);
          }
        }
      );

      uploadStream.end(file.buffer);
    });
  } catch (error) {
    console.error("Error in uploadImageToCloudinary:", error);
    throw error;
  }
};

const uploadPdfToCloudinary = (file) => {
  configureCloudinary();
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        resource_type: "raw", 
        folder: "documents", 
        format: "pdf" // Explicitly specify the format as pdf
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          console.log("File uploaded successfully:", result.public_id);
          resolve(result);
        }
      }
    );

    uploadStream.end(file);
  });
};


export { uploadImageToCloudinary, uploadPdfToCloudinary };