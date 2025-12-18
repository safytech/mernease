import React, { useEffect, useState } from "react";
import Uppy, { UppyFile } from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import axios from "axios";
import Swal from "sweetalert2";
import { coloredToast } from "@/hooks/useToast";
import "./FileUploader.css";

const apiUrl = import.meta.env.VITE_API_URL || "";

interface FileMeta {
  moduleId?: string;
  uploadSessionId: string;
  [key: string]: any;
}

type FileBody = Record<string, unknown>;

interface UploadedFile {
  _id: string;
  originalName: string;
}

interface FileUploaderProps {
  moduleId?: string;
  uploadSessionId: string;
  onUploadSuccess?: (files: UppyFile<FileMeta, FileBody>[]) => void;
  renderKey?: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  moduleId,
  uploadSessionId,
  onUploadSuccess,
}) => {
  const [uppyInstance, setUppyInstance] =
    useState<Uppy<FileMeta, FileBody> | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [deletingFiles, setDeletingFiles] = useState<string[]>([]);

  useEffect(() => {
    const uppy = new Uppy<FileMeta, FileBody>({
      restrictions: { maxNumberOfFiles: 10 },
      autoProceed: false,
      meta: { moduleId, uploadSessionId },
    });

    uppy.use(XHRUpload, {
      endpoint: "/api/file/add",
      fieldName: "file",
      formData: true,
    });

    uppy.on("complete", (result) => {
      fetchUploadedFiles();
      if (onUploadSuccess) {
        onUploadSuccess(result.successful as UppyFile<FileMeta, FileBody>[]);
      }
    });

    setUppyInstance(uppy);
    fetchUploadedFiles();

    return () => {
      try {
        if ((uppy as any).close) (uppy as any).close();
        else uppy.destroy();
      } catch (err) {
        console.warn("Uppy cleanup error:", err);
      }
    };
  }, [uploadSessionId, moduleId]);

  const fetchUploadedFiles = async () => {
    try {
      const res = await axios.get<UploadedFile[]>(
        `/api/file/list?uploadSessionId=${uploadSessionId}`
      );
      setUploadedFiles(res.data || []);
    } catch (err) {
      console.error("Error fetching uploaded files:", err);
    }
  };

  const deleteFile = async (id: string) => {
    try {
      Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: "This action cannot be undone.",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "Cancel",
        padding: "1.8em",
        customClass: {
          popup: "ta-swal-popup",
          confirmButton: "ta-swal-confirm",
          cancelButton: "ta-swal-cancel",
          actions: "ta-swal-actions",
        },
        reverseButtons: false,
        focusCancel: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          setDeletingFiles((prev) => [...prev, id]);
          try {
            await axios.delete(`/api/file/delete/${id}`);
            setTimeout(() => {
              setUploadedFiles((files) =>
                files.filter((file) => file._id !== id)
              );
              setDeletingFiles((prev) => prev.filter((f) => f !== id));
            }, 350);
            coloredToast("success", "File deleted successfully");
          } catch (err) {
            console.error("Error deleting file:", err);
            setDeletingFiles((prev) => prev.filter((f) => f !== id));
            coloredToast("error", "Failed to delete file");
          }
        }
      });
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  return (
    <>
      {uppyInstance && (
        <div className="uppy-wrapper rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f1520] transition-all">
          <Dashboard
            uppy={uppyInstance}
            {...({ inline: true } as any)}
            width="100%"
            height={220}
            proudlyDisplayPoweredByUppy={false}
            theme="auto"
          />
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-5">
          <h5 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Uploaded Files
          </h5>

          <ul className="space-y-2">
            {uploadedFiles.map((file) => (
              <li
                key={file._id}
                className={`flex items-center justify-between rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#0b1117] px-4 py-2.5 transition-opacity duration-400 ${
                  deletingFiles.includes(file._id)
                    ? "opacity-0"
                    : "opacity-100"
                }`}
              >
                <a
                  href={`${apiUrl}/api/file/view/${file._id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="file-link break-all text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  {file.originalName}
                </a>

                <button
                  type="button"
                  onClick={() => deleteFile(file._id)}
                  className="text-red-600 dark:text-red-400 hover:underline text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default FileUploader;
