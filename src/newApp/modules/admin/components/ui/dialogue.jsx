// // components/ui/dialog.jsx
// import * as React from "react"
// import * as DialogPrimitive from "@radix-ui/react-dialog"
// import { X } from "lucide-react"

// const Dialog = DialogPrimitive.Root
// const DialogTrigger = DialogPrimitive.Trigger

// const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
//   <DialogPrimitive.Portal>
//     <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
//     <DialogPrimitive.Content
//       ref={ref}
//       className={`fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-panelShadow p-6 w-full max-w-md ${className}`}
//       {...props}
//     >
//       {children}
//       <DialogPrimitive.Close className="absolute right-4 top-4 opacity-70 hover:opacity-100">
//         <X className="h-4 w-4" />
//       </DialogPrimitive.Close>
//     </DialogPrimitive.Content>
//   </DialogPrimitive.Portal>
// ))
// DialogContent.displayName = "DialogContent"

// const DialogHeader = ({ className, ...props }) => (
//   <div
//     className={`text-center sm:text-left ${className}`}
//     {...props}
//   />
// )
// DialogHeader.displayName = "DialogHeader"

// const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
//   <DialogPrimitive.Title
//     ref={ref}
//     className={`text-lg font-semibold text-headingColor ${className}`}
//     {...props}
//   />
// ))
// DialogTitle.displayName = "DialogTitle"

// export {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// }


import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Document, Page } from 'react-pdf';
import { Button } from "../ui/button";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;

// PDF Viewer Component
const PDFViewer = ({ url }) => {
  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [loading, setLoading] = React.useState(true);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  return (
    <div className="w-full">
      {loading && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        }
      >
        <Page 
          pageNumber={pageNumber} 
          className="max-h-[60vh] overflow-auto"
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>

      {numPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm">
            Page {pageNumber} of {numPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

// Updated DialogContent
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
    <DialogPrimitive.Content
      ref={ref}
      className={`fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-panelShadow p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto ${className}`}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 opacity-70 hover:opacity-100">
        <X className="h-4 w-4" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }) => (
  <div className={`text-center sm:text-left ${className}`} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={`text-lg font-semibold text-headingColor ${className}`}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, PDFViewer };