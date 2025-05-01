// import React, { useState } from 'react';
// import { Upload, ChevronLeft, ChevronRight, X, FileText } from 'lucide-react';
// import HashLoader from "react-spinners/HashLoader";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { BASE_URL } from '../../config';
// import newRequest from '../../utils/newRequest';

// const DocumentUploader = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [note, setNote] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const [pdfUrl, setPdfUrl] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);

//   const handleFileSelect = (event) => {
//     const file = event.target.files[0];
//     if (file && file.type === "application/pdf") {
//       setSelectedFile(file);
//       const fileUrl = URL.createObjectURL(file);
//       setPdfUrl(fileUrl);

//       const loadingTask = pdfjsLib.getDocument(fileUrl);
//       loadingTask.promise.then((pdf) => {
//         setTotalPages(pdf.numPages);
//       });
//     } else {
//       toast.error("Please select a valid PDF file");
//     }
//   };

//   // Add drag and drop handlers
//   const handleDragEnter = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);

//     const file = e.dataTransfer.files[0];
//     if (file && file.type === "application/pdf") {
//       setSelectedFile(file);
//       const fileUrl = URL.createObjectURL(file);
//       setPdfUrl(fileUrl);

//       const loadingTask = pdfjsLib.getDocument(fileUrl);
//       loadingTask.promise.then((pdf) => {
//         setTotalPages(pdf.numPages);
//       });
//     } else {
//       toast.error("Please select a valid PDF file");
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       toast.error("No file selected");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", selectedFile);
//     formData.append("note", note);

//     setUploading(true);
//     try {
//       const response = await newRequest.post(`${BASE_URL}users/documents-upload`, formData, {
//         credentials: 'include',
//       });
//       console.log(response);
//       if (response.status !== 200) {
//         throw new Error('Upload failed');
//       }

//       const data = await response.data;
//       toast.success(data.message);
//       setSelectedFile(null);
//       setNote('');
//       setPdfUrl(null);
//       setCurrentPage(1);
//       setTotalPages(0);
//     } catch (error) {
//       toast.error(error.message || "Failed to upload document");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prev) => prev - 1);
//     }
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage((prev) => prev + 1);
//     }
//   };

//   const clearSelection = () => {
//     setSelectedFile(null);
//     setPdfUrl(null);
//     setCurrentPage(1);
//     setTotalPages(0);
//     setNote('');
//     if (pdfUrl) {
//       URL.revokeObjectURL(pdfUrl);
//     }
//   };

//   return (
//     <section className="my-10">
//       <div className="w-full max-w-[770px] mx-auto rounded-lg shadow-md p-10">
//         <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-6 text-center">
//           Upload Document
//         </h3>
//         <ul className="list-disc list-inside text-sm text-blue-500 text-center mb-4">
//           <li>Please add 1 exercise per PDF.</li>
//           <li>If you have many PDFs, submit one by one sequentially.</li>
//         </ul>

//         {!selectedFile ? (
//           <div className="mb-6">
//             <div
//               onDragEnter={handleDragEnter}
//               onDragOver={handleDragOver}
//               onDragLeave={handleDragLeave}
//               onDrop={handleDrop}
//               className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
//                 ${isDragging 
//                   ? 'border-primaryColor bg-blue-50' 
//                   : 'border-gray-300 hover:border-primaryColor'
//                 }`}
//             >
//               <input
//                 type="file"
//                 onChange={handleFileSelect}
//                 accept=".pdf"
//                 className="hidden"
//                 id="file-upload"
//               />
//               <label
//                 htmlFor="file-upload"
//                 className="cursor-pointer flex flex-col items-center"
//               >
//                 <Upload className={`w-12 h-12 mb-4 transition-colors ${isDragging ? 'text-primaryColor' : 'text-gray-400'}`} />
//                 <span className={`text-gray-600 ${isDragging ? 'text-primaryColor' : ''}`}>
//                   {isDragging ? 'Drop your PDF here' : 'Click to upload or drag and drop'}
//                 </span>
//                 <span className="text-sm text-gray-400 mt-2">
//                   PDF files only
//                 </span>
//               </label>
//             </div>
//           </div>
//         ) : (
//           /* Rest of your existing code for the selected file view */
//           <>
//             <div className="relative mb-6 bg-gray-50 rounded-lg p-4">
//               <button
//                 onClick={clearSelection}
//                 className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>

//               <div className="flex items-center gap-3 mb-4">
//                 <FileText className="w-8 h-8 text-primaryColor" />
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-gray-900 truncate">
//                     {selectedFile.name}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
//                   </p>
//                 </div>
//               </div>

//               {pdfUrl && (
//                 <div className="relative w-full h-[400px] mb-4 bg-white rounded border">
//                   <iframe
//                     src={`${pdfUrl}#page=${currentPage}`}
//                     className="w-full h-full rounded"
//                     title="PDF Preview"
//                   />

//                   <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow">
//                     <button
//                       onClick={handlePrevPage}
//                       disabled={currentPage === 1}
//                       className={`p-1 rounded-full ${currentPage === 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
//                     >
//                       <ChevronLeft className="w-5 h-5" />
//                     </button>
//                     <span className="text-sm text-gray-600">
//                       Page {currentPage} of {totalPages}
//                     </span>
//                     <button
//                       onClick={handleNextPage}
//                       disabled={currentPage === totalPages}
//                       className={`p-1 rounded-full ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
//                     >
//                       <ChevronRight className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Add Notes
//               </label>
//               <div className="relative">
//                 <textarea
//                   value={note}
//                   onChange={(e) => setNote(e.target.value)}
//                   className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primaryColor focus:border-primaryColor min-h-[120px] transition-all duration-200 ease-in-out"
//                   placeholder="Add any additional notes or comments about this document..."
//                   rows="4"
//                 />
//                 <div className="absolute bottom-2 right-2 text-xs text-gray-400">
//                   {note.length}/500
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         <button
//           onClick={handleUpload}
//           disabled={!selectedFile || uploading}
//           className={`w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 flex items-center justify-center
//             ${(!selectedFile || uploading) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700 transition-colors'}`}
//         >
//           {uploading ? (
//             <HashLoader size={35} color="#fff" />
//           ) : (
//             "Upload Document"
//           )}
//         </button>
//       </div>
//     </section>
//   );
// };

// export default DocumentUploader;



import React, { useState } from 'react';
import { Upload, ChevronLeft, ChevronRight, X, FileText } from 'lucide-react';
import HashLoader from "react-spinners/HashLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from '../../config';
import newRequest from '../../utils/newRequest';

const DocumentUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [note, setNote] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const allowedFileTypes = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX'
  };

  const isValidFileType = (file) => {
    return Object.keys(allowedFileTypes).includes(file.type);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && isValidFileType(file)) {
      setSelectedFile(file);
      if (file.type === 'application/pdf') {
        const fileUrl = URL.createObjectURL(file);
        setPdfUrl(fileUrl);

        const loadingTask = pdfjsLib.getDocument(fileUrl);
        loadingTask.promise.then((pdf) => {
          setTotalPages(pdf.numPages);
        });
      } else {
        setPdfUrl(null);
        setTotalPages(0);
      }
    } else {
      toast.error("Please select a valid PDF or Word document");
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && isValidFileType(file)) {
      setSelectedFile(file);
      if (file.type === 'application/pdf') {
        const fileUrl = URL.createObjectURL(file);
        setPdfUrl(fileUrl);

        const loadingTask = pdfjsLib.getDocument(fileUrl);
        loadingTask.promise.then((pdf) => {
          setTotalPages(pdf.numPages);
        });
      } else {
        setPdfUrl(null);
        setTotalPages(0);
      }
    } else {
      toast.error("Please select a valid PDF or Word document");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("note", note);

    setUploading(true);
    try {
      const response = await newRequest.post(`${BASE_URL}users/documents-upload`, formData, {
        credentials: 'include',
      });
      if (response.status !== 200) {
        throw new Error('Upload failed');
      }

      const data = await response.data;
      toast.success(data.message);
      clearSelection();
    } catch (error) {
      toast.error(error.response.data|| "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPdfUrl(null);
    setCurrentPage(1);
    setTotalPages(0);
    setNote('');
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
  };

  const getFileIcon = (fileType) => {
    return <FileText className={`w-8 h-8 ${fileType === 'application/pdf' ? 'text-red-500' : 'text-blue-500'}`} />;
  };

  return (
    <section className="my-10">
      <div className="w-full max-w-[770px] mx-auto rounded-lg shadow-md p-10">
        <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-6 text-center">
          Read this before submitting your document.
        </h3>
        <ul className="list-disc list-inside text-sm text-blue-500 text-center mb-4">
        <li>Supported formats: PDF, WORD (DOC, DOCX)</li>
        <li>File size must not exceed 10MB</li>
        <li>It is recommended to use English or French for file names</li>
          <li>Please add 1 exercise per document.</li>
          <li>If you have many documents, submit one by one sequentially.</li>
        </ul>

        {!selectedFile ? (
          <div className="mb-6">
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${isDragging 
                  ? 'border-primaryColor bg-blue-50' 
                  : 'border-gray-300 hover:border-primaryColor'
                }`}
            >
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className={`w-12 h-12 mb-4 transition-colors ${isDragging ? 'text-primaryColor' : 'text-gray-400'}`} />
                <span className={`text-gray-600 ${isDragging ? 'text-primaryColor' : ''}`}>
                  {isDragging ? 'Drop your document here' : 'Click to upload or drag and drop'}
                </span>
                <span className="text-sm text-gray-400 mt-2">
                  PDF, DOC, DOCX files accepted
                </span>
              </label>
            </div>
          </div>
        ) : (
          <>
            <div className="relative mb-6 bg-gray-50 rounded-lg p-4">
              <button
                onClick={clearSelection}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                {getFileIcon(selectedFile.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {allowedFileTypes[selectedFile.type]}
                  </p>
                </div>
              </div>

              {pdfUrl && (
                <div className="relative w-full h-[400px] mb-4 bg-white rounded border">
                  <iframe
                    src={`${pdfUrl}#page=${currentPage}`}
                    className="w-full h-full rounded"
                    title="PDF Preview"
                  />

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`p-1 rounded-full ${currentPage === 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`p-1 rounded-full ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Notes
              </label>
              <div className="relative">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primaryColor focus:border-primaryColor min-h-[120px] transition-all duration-200 ease-in-out"
                  placeholder="Add any additional notes or comments about this document..."
                  rows="4"
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                  {note.length}/500
                </div>
              </div>
            </div>
          </>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className={`w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 flex items-center justify-center
            ${(!selectedFile || uploading) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700 transition-colors'}`}
        >
          {uploading ? (
            <HashLoader size={35} color="#fff" />
          ) : (
            "Upload Document"
          )}
        </button>
      </div>
    </section>
  );
};

export default DocumentUploader;