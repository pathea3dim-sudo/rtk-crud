



"use client";

import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { useUploadSingleFileMutation } from "@/services/uploadApi";

export function FileUploadFillProgressDemo() {
  const [uploadSingleFile] = useUploadSingleFileMutation();
  const [files, setFiles] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);

  const onUpload = React.useCallback(
    async (
      files: File[],
      {
        onProgress,
        onSuccess,
        onError,
      }: {
        onProgress: (file: File, progress: number) => void;
        onSuccess: (file: File) => void;
        onError: (file: File, error: Error) => void;
      },
    ) => {
      setIsUploading(true);
      
      try {
        // Upload each file individually with progress tracking
        const uploadPromises = files.map(async (file) => {
          try {
            const totalChunks = 10;
            let uploadedChunks = 0;

            // Simulate progress before actual upload
            for (let i = 0; i < totalChunks; i++) {
              await new Promise((resolve) =>
                setTimeout(resolve, Math.random() * 200 + 100)
              );
              uploadedChunks++;
              const progress = (uploadedChunks / totalChunks) * 100;
              onProgress(file, progress);
            }

            // Actual upload
            const result = await uploadSingleFile(file).unwrap();
            console.log(`Uploaded ${file.name}:`, result);
            
            onSuccess(file);
          } catch (error) {
            onError(
              file,
              error instanceof Error ? error : new Error("Upload failed")
            );
            throw error; // Re-throw to handle in Promise.all
          }
        });

        await Promise.all(uploadPromises);
        toast.success(`Successfully uploaded ${files.length} file(s)`);
        
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Some files failed to upload");
      } finally {
        setIsUploading(false);
      }
    },
    [uploadSingleFile]
  );

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  return (
    <FileUpload
      value={files}
      onValueChange={setFiles}
      maxFiles={10}
      maxSize={5 * 1024 * 1024}
      className="w-full max-w-md"
      onUpload={onUpload}
      onFileReject={onFileReject}
      multiple
      disabled={isUploading}
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">Drag & drop files here</p>
          <p className="text-muted-foreground text-xs">
            Or click to browse (max 10 files, up to 5MB each)
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit">
            Browse files
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList orientation="horizontal">
        {files.map((file, index) => (
          <FileUploadItem key={index} value={file} className="p-0">
            <FileUploadItemPreview className="size-20">
              <FileUploadItemProgress variant="fill" />
            </FileUploadItemPreview>

            <FileUploadItemMetadata className="sr-only" />
            <FileUploadItemDelete asChild>
              <Button
                variant="secondary"
                size="icon"
                className="absolute -top-1 -right-1 size-5 rounded-full"
              >
                <X className="size-3" />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}












// "use client";
 
// import { Upload, X } from "lucide-react";
// import * as React from "react";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import {
//   FileUpload,
//   FileUploadDropzone,
//   FileUploadItem,
//   FileUploadItemDelete,
//   FileUploadItemMetadata,
//   FileUploadItemPreview,
//   FileUploadItemProgress,
//   FileUploadList,
//   FileUploadTrigger,
// } from "@/components/ui/file-upload";
// import { useUpdateProductMutation } from "@/services/ecommerce";
// // import { useUploadFilesMutation } from "@/services/uploadApi";
// import { useUploadFilesMutation } from "@/services/uploadApi";

 
// export function FileUploadFillProgressDemo() {
//   // uploadfile hook 
//   const [uploadMutiFiles] = useUploadFilesMutation();
  
//   const [files, setFiles] = React.useState<File[]>([]);
 
//   const onUpload = React.useCallback(
//     async (
//       files: File[],
//       {
//         onProgress,
//         onSuccess,
//         onError,
//       }: {
//         onProgress: (file: File, progress: number) => void;
//         onSuccess: (file: File) => void;
//         onError: (file: File, error: Error) => void;
//       },
//     ) => {
//       try {
//         // Process each file individually
       
//         const uploadPromises = files.map(async (file) => {
//           try {
//             // Simulate file upload with progress
//              await uploadMutiFiles(file);

//             const totalChunks = 10;
//             let uploadedChunks = 0;
 
//             // Simulate chunk upload with delays
//             for (let i = 0; i < totalChunks; i++) {
//               // Simulate network delay (100-300ms per chunk)
//               await new Promise((resolve) =>
//                 setTimeout(resolve, Math.random() * 200 + 100),
//               );
 
//               // Update progress for this specific file
//               uploadedChunks++;
//               const progress = (uploadedChunks / totalChunks) * 100;
//               onProgress(file, progress);
//             }
 
//             // Simulate server processing delay
//             await new Promise((resolve) => setTimeout(resolve, 500));
//             onSuccess(file);
//           } catch (error) {
//             onError(
//               file,
//               error instanceof Error ? error : new Error("Upload failed"),
//             );
//           }
//         });
 
//         // Wait for all uploads to complete
//         const multiFiles = await Promise.all(uploadPromises);
//         console.log(multiFiles);
        
//       } catch (error) {
//         // This handles any error that might occur outside the individual upload processes
//         console.error("Unexpected error during upload:", error);
//       }
//     },
//     [],
//   );
 
//   const onFileReject = React.useCallback((file: File, message: string) => {
//     toast(message, {
//       description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
//     });
//   }, []);
 
//   return (
//     <FileUpload
//       value={files}
//       onValueChange={setFiles}
//       maxFiles={10}
//       maxSize={5 * 1024 * 1024}
//       className="w-full max-w-md"
//       onUpload={onUpload}
//       onFileReject={onFileReject}
//       multiple
//     >
//       <FileUploadDropzone>
//         <div className="flex flex-col items-center gap-1 text-center">
//           <div className="flex items-center justify-center rounded-full border p-2.5">
//             <Upload className="size-6 text-muted-foreground" />
//           </div>
//           <p className="font-medium text-sm">Drag & drop files here</p>
//           <p className="text-muted-foreground text-xs">
//             Or click to browse (max 10 files, up to 5MB each)
//           </p>
//         </div>
//         <FileUploadTrigger asChild>
//           <Button variant="outline" size="sm" className="mt-2 w-fit">
//             Browse files
//           </Button>
//         </FileUploadTrigger>
//       </FileUploadDropzone>
//       <FileUploadList orientation="horizontal">
//         {files.map((file, index) => (
//           <FileUploadItem key={index} value={file} className="p-0">
//             <FileUploadItemPreview className="size-20">
//               <FileUploadItemProgress variant="fill" />
//             </FileUploadItemPreview>

//             <FileUploadItemMetadata className="sr-only" />
//             <FileUploadItemDelete asChild>
//               <Button
//                 variant="secondary"
//                 size="icon"
//                 className="absolute -top-1 -right-1 size-5 rounded-full"
//               >
//                 <X className="size-3" />
//               </Button>
//             </FileUploadItemDelete>
//           </FileUploadItem>
//         ))}
//       </FileUploadList>
//     </FileUpload>
//   );
// }
