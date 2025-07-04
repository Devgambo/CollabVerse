"use client";

import React, { useEffect, useState } from "react";
import { File, Folder, Tree } from "@/src/components/magicui/file-tree";
import { FolderPlus, Trash2, Edit2, FileText, Check, X } from "lucide-react";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { ParamValue } from "next/dist/server/request/params";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { mapExtensionToLanguage } from "@/src/lib/utils";

type OperationType =
  | "create-file"
  | "create-folder"
  | "rename"
  | "delete"
  | null;

interface FileOperation {
  type: OperationType;
  targetId: string | null;
}

interface Props {
  roomId: ParamValue;
  activeFileId: string;
  setActiveFileId: (fileId: string) => void;
}

interface FileWithActionsProps {
  file: FileSample;
  onClick: React.MouseEventHandler;
  onAction: (type: OperationType, fileId: string) => void;
  activeOperation: FileOperation | null;
}

interface FolderWithActionsProps {
  file: FileSample;
  children: React.ReactNode;
  onAction: (type: OperationType, fileId: string) => void;
  activeOperation: FileOperation | null;
}

export type FileSample = {
  _id: string;
  name: string;
  type: "folder" | "file";
  roomId: string;
  parentId: string | null;
  extension?: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
};

// Function to extract name and extension from a filename
const extractExtension = (
  fileName: string,
): { name: string; extension: string } => {
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot === -1 || lastDot === 0) {
    return { name: fileName, extension: "" };
  }
  return {
    name: fileName.slice(0, lastDot),
    extension: fileName.slice(lastDot + 1),
  };
};

// Function to get full filename (with extension)
const getFullFileName = (file: FileSample): string => {
  if (file.type === "folder" || !file.extension) {
    return file.name;
  }
  return `${file.name}.${file.extension}`;
};

const FileOperationInput = ({
  operation,
  initialName = "",
  onComplete,
  onCancel,
}: {
  operation: FileOperation;
  initialName?: string;
  onComplete: (name: string, extension?: string) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState(initialName);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (
      operation.type === "create-file" ||
      (operation.type === "rename" && name.includes("."))
    ) {
      const { name: baseName, extension } = extractExtension(name.trim());
      onComplete(baseName, extension);
    } else {
      onComplete(name.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  const icon =
    operation.type === "create-file" ? (
      <FileText className="h-4 w-4 text-green-400" />
    ) : operation.type === "create-folder" ? (
      <FolderPlus className="h-4 w-4 text-blue-400" />
    ) : (
      <Edit2 className="h-4 w-4 text-yellow-400" />
    );

  const placeholder =
    operation.type === "create-file"
      ? "filename.ext"
      : operation.type === "create-folder"
        ? "folder name"
        : "new name";

  return (
    <div className="flex items-center gap-1 py-0.5 pl-0.5 pr-2 mb-2">
      <div className="flex items-center gap-1">
        {icon}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="bg-slate-800 text-white px-2 py-1 rounded text-sm border border-slate-600 focus:border-blue-400 focus:outline-none"
          autoFocus
        />
      </div>
      <button
        onClick={handleSubmit}
        className="p-1 hover:bg-slate-700 rounded-sm"
      >
        <Check className="h-3.5 w-3.5 text-green-400" />
      </button>
      <button onClick={onCancel} className="p-1 hover:bg-slate-700 rounded-sm">
        <X className="h-3.5 w-3.5 text-red-400" />
      </button>
    </div>
  );
};

const DeleteConfirmation = ({
  item,
  onConfirm,
  onCancel,
}: {
  item: FileSample;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const displayName = getFullFileName(item);

  return (
    <div className="p-3 bg-slate-800 border border-slate-700 rounded-md mb-2">
      {/* <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="h-5 w-5 text-amber-400" />
        <span className="text-sm font-medium">Delete {item.type}</span>
      </div>
      <p className="text-sm text-slate-300 mb-3">
        Are you sure you want to delete "{displayName}"
        {item.type === "folder" ? " and all its contents" : ""}?
        <br />
        <span className="text-red-400 text-xs mt-1 block">
          This action cannot be undone.
        </span>
      </p> */}
      <div>Deleting</div>
      <div className="flexi justify-end gap-2 hidden">
        <button
          onClick={onCancel}
          className="px-3 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-white"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-3 py-1 text-xs rounded bg-red-600 hover:bg-red-700 text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const FileWithActions = ({
  file,
  onClick,
  onAction,
  activeOperation,
}: FileWithActionsProps) => {
  const isRenaming =
    activeOperation?.type === "rename" &&
    activeOperation?.targetId === file._id;
  const isDeleting =
    activeOperation?.type === "delete" &&
    activeOperation?.targetId === file._id;

  const displayName = getFullFileName(file);

  if (isRenaming) {
    return (
      <FileOperationInput
        operation={{ type: "rename", targetId: file._id }}
        initialName={displayName}
        onComplete={(name, extension) => {
          onAction("rename", file._id);
          // Pass the input directly to the operation handler
          processFileRename(file._id, name, extension);
        }}
        onCancel={() => onAction(null, "")}
      />
    );
  }

  if (isDeleting) {
    return (
      <DeleteConfirmation
        item={file}
        onConfirm={() => onAction("delete", file._id)}
        onCancel={() => onAction(null, "")}
      />
    );
  }

  return (
    <div className="flex items-center group" onClick={onClick}>
      <div className="flex-grow flex items-center">
        <File
          value={file._id}
          className="hover:bg-slate-800/60 py-0.5 pl-0.5 pr-2 rounded-md"
        >
          {displayName}
        </File>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity -ml-16 pl-6 pr-1 bg-gradient-to-r from-transparent via-slate-900/80 to-slate-900/90">
        <button
          className="p-1 hover:bg-slate-800 rounded-sm"
          onClick={(e) => {
            e.stopPropagation();
            onAction("rename", file._id);
          }}
          aria-label="Rename file"
        >
          <Edit2 className="h-3.5 w-3.5 text-blue-400" />
        </button>
        <button
          className="p-1 hover:bg-slate-800 rounded-sm"
          onClick={(e) => {
            e.stopPropagation();
            onAction("delete", file._id);
          }}
          aria-label="Delete file"
        >
          <Trash2 className="h-3.5 w-3.5 text-red-400" />
        </button>
      </div>
    </div>
  );
};

const FolderWithActions = ({
  file,
  children,
  onAction,
  activeOperation,
}: FolderWithActionsProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const isCreatingFile =
    activeOperation?.type === "create-file" &&
    activeOperation?.targetId === file._id;
  const isCreatingFolder =
    activeOperation?.type === "create-folder" &&
    activeOperation?.targetId === file._id;
  const isRenaming =
    activeOperation?.type === "rename" &&
    activeOperation?.targetId === file._id;
  const isDeleting =
    activeOperation?.type === "delete" &&
    activeOperation?.targetId === file._id;

  if (isRenaming) {
    return (
      <FileOperationInput
        operation={{ type: "rename", targetId: file._id }}
        initialName={file.name}
        onComplete={(name) => {
          onAction("rename", file._id);
          // Pass the input directly to the operation handler
          processFileRename(file._id, name);
        }}
        onCancel={() => onAction(null, "")}
      />
    );
  }

  if (isDeleting) {
    return (
      <DeleteConfirmation
        item={file}
        onConfirm={() => onAction("delete", file._id)}
        onCancel={() => onAction(null, "")}
      />
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        <Folder
          value={file._id}
          element={
            <div className="flex items-center w-full">
              <span className="mr-auto">{file.name}</span>
              {isHovered && (
                <div className="flex items-center gap-1 ml-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="p-1 hover:bg-slate-700/60 rounded-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAction("create-file", file._id);
                          }}
                          aria-label="New file"
                        >
                          <FileText className="h-3.5 w-3.5 text-green-400" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="bg-slate-800 text-white border-slate-700"
                      >
                        New File
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="p-1 hover:bg-slate-700/60 rounded-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAction("create-folder", file._id);
                          }}
                          aria-label="New folder"
                        >
                          <FolderPlus className="h-3.5 w-3.5 text-blue-400" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="bg-slate-800 text-white border-slate-700"
                      >
                        New Folder
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="p-1 hover:bg-slate-700/60 rounded-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAction("rename", file._id);
                          }}
                          aria-label="Rename folder"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-yellow-400" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="bg-slate-800 text-white border-slate-700"
                      >
                        Rename
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="p-1 hover:bg-slate-700/60 rounded-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAction("delete", file._id);
                          }}
                          aria-label="Delete folder"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-400" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="bg-slate-800 text-white border-slate-700"
                      >
                        Delete
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          }
        >
          {isCreatingFile && (
            <FileOperationInput
              operation={{ type: "create-file", targetId: file._id }}
              onComplete={(name, extension) => {
                onAction("create-file", file._id);
                // Pass the input directly to the operation handler
                processFileCreate(file._id, name, extension);
              }}
              onCancel={() => onAction(null, "")}
            />
          )}
          {isCreatingFolder && (
            <FileOperationInput
              operation={{ type: "create-folder", targetId: file._id }}
              onComplete={(name) => {
                onAction("create-folder", file._id);
                // Pass the input directly to the operation handler
                processFolderCreate(file._id, name);
              }}
              onCancel={() => onAction(null, "")}
            />
          )}
          {children}
        </Folder>
      </div>
    </div>
  );
};

// Declare these functions outside the main component so they can be used by child components
let processFileCreate: (
  parentId: string | null,
  name: string,
  extension?: string,
) => Promise<void>;
let processFolderCreate: (
  parentId: string | null,
  name: string,
) => Promise<void>;
let processFileRename: (
  fileId: string,
  name: string,
  extension?: string,
) => Promise<void>;

//////////////////////MAIN COMPONENT

export default function FileSystem({
  activeFileId,
  setActiveFileId,
  roomId,
}: Props) {
  const [fileSystem, setFileSystem] = useState<FileSample[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeOperation, setActiveOperation] = useState<FileOperation | null>(
    null,
  );
  const { user } = useUser();

  const createFileOrFolder = useMutation(api.fileSystem.createFileOrFolder);
  const updateFileOrFolder = useMutation(api.fileSystem.updateFileOrFolder);
  const deleteFileOrFolder = useMutation(api.fileSystem.deleteFileOrFolder);
  const filesList = useQuery(api.fileSystem.getFilesFolders, {
    roomId: roomId as string,
  }) as {
    files: FileSample[];
  };

  console.log(filesList);

  // fileSystem will be undefined initially while loading, then real data
  useEffect(() => {
    if (filesList) {
      setFileSystem(filesList.files || []);
    }
  }, [filesList]);

  // Define the API operation handlers for use in child components
  processFileCreate = async (
    parentId: string | null,
    name: string,
    extension?: string,
  ) => {
    if (!user?.id) {
      toast.error("You must be signed in to create files");
      setActiveOperation(null);
      return;
    }

    try {
      setIsProcessing(true);
      const toastId = toast.loading("Creating file...");
      const language = mapExtensionToLanguage(extension);
      console.log(language);

      await createFileOrFolder({
        name,
        roomId: roomId as string,
        parentId: parentId,
        type: "file",
        extension: extension || "",
        language: language,
        userId: user.id,
      });

      toast.success("File created successfully", { id: toastId });
      setActiveOperation(null);
    } catch (error) {
      console.error("Error creating file:", error);
      toast.error("Failed to create file");
    } finally {
      setIsProcessing(false);
    }
  };

  processFolderCreate = async (parentId: string | null, name: string) => {
    if (!user?.id) {
      toast.error("You must be signed in to create folders");
      setActiveOperation(null);
      return;
    }

    try {
      setIsProcessing(true);
      const toastId = toast.loading("Creating folder...");

      await createFileOrFolder({
        name,
        roomId: roomId as string,
        parentId: parentId,
        type: "folder",
        userId: user.id,
      });

      toast.success("Folder created successfully", { id: toastId });
      setActiveOperation(null);
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder");
    } finally {
      setIsProcessing(false);
    }
  };

  processFileRename = async (
    fileId: string,
    name: string,
    extension?: string,
  ) => {
    if (!user?.id) {
      toast.error("You must be signed in to rename files");
      setActiveOperation(null);
      return;
    }

    try {
      setIsProcessing(true);
      const toastId = toast.loading("Renaming...");

      await updateFileOrFolder({
        fileId: fileId,
        name: name,
        extension: extension,
        userId: user.id,
      });

      toast.success("Item renamed successfully", { id: toastId });
      setActiveOperation(null);
    } catch (error) {
      console.error("Error renaming item:", error);
      toast.error("Failed to rename item");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileAction = (type: OperationType, targetId: string | null) => {
    if (!type) {
      setActiveOperation(null);
      return;
    }

    setActiveOperation({ type, targetId });

    if (type === "delete") {
      confirmDelete(targetId);
    }
  };

  const getFileById = (id: string): FileSample | undefined => {
    return fileSystem.find((file) => file._id === id);
  };

  const confirmDelete = async (fileId: string | null) => {
    if (!fileId || !user?.id) {
      toast.error("You must be signed in to delete files");
      setActiveOperation(null);
      return;
    }

    try {
      setIsProcessing(true);
      const itemToDelete = getFileById(fileId);
      if (!itemToDelete) {
        toast.error("Item not found");
        setActiveOperation(null);
        setIsProcessing(false);
        return;
      }

      const toastId = toast.loading(
        `Deleting ${itemToDelete?.type || "item"}...`,
      );

      await deleteFileOrFolder({
        fileId,
        userId: user.id,
      });

      toast.success("Item deleted successfully", { id: toastId });

      if (activeFileId === fileId) {
        setActiveFileId("");
      }

      setActiveOperation(null);
      // await fetchFilesFromServer();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileClick = (fileId: string) => {
    setActiveFileId(fileId);
  };

  const renderFilesByParentId = (parentId: string | null) => {
    const files = fileSystem.filter((file) => {
      // Handle null parentId properly
      if (parentId === null) {
        return file.parentId === null || file.parentId === undefined;
      }
      return file.parentId === parentId;
    });

    if (files.length === 0) {
      return null;
    }

    const groupFiles = [
      ...files.filter((file) => file.type === "folder"),
      ...files.filter((file) => file.type !== "folder"),
    ];

    return groupFiles.map((file) => (
      <div key={file._id}>
        {file.type === "folder" ? (
          <FolderWithActions
            file={file}
            onAction={handleFileAction}
            activeOperation={activeOperation}
          >
            {renderFilesByParentId(file._id)}
          </FolderWithActions>
        ) : (
          <FileWithActions
            file={file}
            onClick={() => handleFileClick(file._id)}
            onAction={handleFileAction}
            activeOperation={activeOperation}
          />
        )}
      </div>
    ));
  };

  const renderTopLevelActions = () => (
    <div className="mb-4 flex items-center gap-2">
      <button
        onClick={() => handleFileAction("create-file", null)}
        className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
        disabled={isProcessing || !!activeOperation}
      >
        <FileText className="h-3.5 w-3.5 text-green-400" />
        <span>New File</span>
      </button>

      <button
        onClick={() => handleFileAction("create-folder", null)}
        className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
        disabled={isProcessing || !!activeOperation}
      >
        <FolderPlus className="h-3.5 w-3.5 text-blue-400" />
        <span>New Folder</span>
      </button>
    </div>
  );

  return (
    <div className="max-h-[80vh] overflow-auto bg-slate-900/50 border border-slate-800 rounded-lg p-4">
      {renderTopLevelActions()}

      {activeOperation?.targetId === null && (
        <div className="mb-2">
          {activeOperation?.type === "create-file" && (
            <FileOperationInput
              operation={{ type: "create-file", targetId: null }}
              onComplete={(name, extension) => {
                setActiveOperation(null);
                processFileCreate(null, name, extension);
              }}
              onCancel={() => setActiveOperation(null)}
            />
          )}
          {activeOperation?.type === "create-folder" && (
            <FileOperationInput
              operation={{ type: "create-folder", targetId: null }}
              onComplete={(name) => {
                setActiveOperation(null);
                processFolderCreate(null, name);
              }}
              onCancel={() => setActiveOperation(null)}
            />
          )}
        </div>
      )}

      {fileSystem.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <FolderPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No files yet. Create a new file or folder to get started.</p>
        </div>
      ) : (
        <Tree>{renderFilesByParentId(null)}</Tree>
      )}

      {isProcessing && (
        <div className="fixed inset-0 bg-black/5 flex items-center justify-center pointer-events-none z-50">
          <span className="sr-only">Processing...</span>
        </div>
      )}
    </div>
  );
}
