// import { v2 as cloudinary } from "cloudinary";

// // Configure Cloudinary
// const configureCloudinary = () => {
//   const requiredEnvVars = [
//     'CLOUDINARY_CLOUD_NAME',
//     'CLOUDINARY_API_KEY',
//     'CLOUDINARY_API_SECRET'
//   ];

//   const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

//   if (missingEnvVars.length > 0) {
//     throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
//   }

//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//     secure: true, // Enable HTTPS
//   });

//   // Enable debug mode in development
//   if (process.env.NODE_ENV !== 'production') {
//     cloudinary.config().debug = true;
//   }

//   console.log('Cloudinary configured successfully');
// };

// const validateFile = (file) => {
//   console.log('file ::: ',file)
//   if (!file || !file.buffer) {
//     throw new Error("Invalid file object");
//   }
// };

// const uploadImageToCloudinary = async (file) => {
//   try {
//     configureCloudinary();
//     validateFile(file);

//     return new Promise((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         { resource_type: "auto" },
//         (error, result) => {
//           if (error) {
//             console.error("Cloudinary upload error:", error);
//             reject(error);
//           } else {
//             console.log("File uploaded successfully:", result);
//             resolve(result);
//           }
//         }
//       );

//       uploadStream.end(file.buffer);
//     });
//   } catch (error) {
//     console.error("Error in uploadImageToCloudinary:", error);
//     throw error;
//   }
// };

// const uploadPdfToCloudinary = (file) => {
//   configureCloudinary();
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       { 
//         resource_type: "raw", 
//         folder: "documents", 
//         format: "pdf" // Explicitly specify the format as pdf
//       },
//       (error, result) => {
//         if (error) {
//           console.error("Cloudinary upload error:", error);
//           reject(error);
//         } else {
//           console.log("File uploaded successfully:", result.public_id);
//           resolve(result);
//         }
//       }
//     );

//     uploadStream.end(file);
//   });
// };


// export { uploadImageToCloudinary, uploadPdfToCloudinary };
import { v2 as cloudinary } from "cloudinary";

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
    secure: true,
  });

  if (process.env.NODE_ENV !== 'production') {
    cloudinary.config().debug = true;
  }
};

const validateFile = (file) => {
  if (!file) {
    throw new Error("No file provided");
  }

  if (!file.buffer && !(file instanceof Buffer) && !(file instanceof Blob)) {
    throw new Error("Invalid file format - must contain buffer data");
  }
};

const SUPPORTED_MIME_TYPES = {
  'application/pdf': {
    type: 'pdf',
    folder: 'documents'
  },
  'application/msword': {
    type: 'doc',
    folder: 'documents'
  },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    type: 'docx',
    folder: 'documents'
  },
  'image': {
    type: 'auto',
    folder: 'images'
  }
};

const getFileType = (file) => {
  // Handle image files
  if (file.mimetype && file.mimetype.startsWith('image/')) {
    return SUPPORTED_MIME_TYPES['image'];
  }

  // Handle documents
  const fileType = SUPPORTED_MIME_TYPES[file.mimetype];
  if (!fileType) {
    throw new Error(`Unsupported file type: ${file.mimetype}`);
  }

  return fileType;
};

const uploadFile = async (file) => {
  try {
    configureCloudinary();
    validateFile(file);

    const fileType = getFileType(file);
    const isImage = file.mimetype?.startsWith('image/');

    const uploadOptions = {
      resource_type: isImage ? "auto" : "raw",
      folder: fileType.folder,
      public_id: `${Date.now()}_${file.originalname?.replace(/\.[^/.]+$/, "") || 'file'}`,
      ...(isImage && {
        transformation: {
          quality: "auto",
          fetch_format: "auto"
        }
      }),
      ...(!isImage && {
        format: fileType.type
      })
    };

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve({
              ...result,
              fileType: fileType.type,
              originalName: file.originalname
            });
          }
        }
      );

      uploadStream.end(file.buffer);
    });
  } catch (error) {
    console.error("Error in uploadFile:", error);
    throw error;
  }
};

const isSupportedFileType = (mimeType) => {
  if (mimeType.startsWith('image/')) return true;
  return Object.keys(SUPPORTED_MIME_TYPES).includes(mimeType);
};

export {
  uploadFile,
  isSupportedFileType,
  configureCloudinary,
  SUPPORTED_MIME_TYPES
};