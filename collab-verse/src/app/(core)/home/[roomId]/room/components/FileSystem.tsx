import React, { useState } from "react";
import SampleFileSystem from "@/public/file_sys.json";
import { File, Folder, Tree } from "@/src/components/magicui/file-tree";
import { PlusCircle, FolderPlus, Trash2, Edit2, FileText } from "lucide-react";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";

interface Props {
  activeFileId: string;
  setActiveFileId: (fileId: string) => void;
}

interface FileWithActionsProps {
  file: any;
  onClick: React.MouseEventHandler;
  onRename: (fileId: string) => void;
  onDelete: (fileId: string) => void;
}

interface FolderWithActionsProps {
  file: any;
  children: React.ReactNode;
  onCreateFile: (parentId: string) => void;
  onCreateFolder: (parentId: string) => void;
  onRename: (fileId: string) => void;
  onDelete: (fileId: string) => void;
}

// File component with hover actions
const FileWithActions = ({
  file,
  onClick,
  onRename,
  onDelete,
}: FileWithActionsProps) => {
  return (
    <div className="flex items-center group" onClick={onClick}>
      <div className="flex-grow flex items-center">
        <File
          value={file._id}
          className="hover:bg-slate-800/60 py-0.5 pl-0.5 pr-2 rounded-md"
        >
          {file.name}
        </File>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity -ml-16 pl-6 pr-1 bg-gradient-to-r from-transparent via-slate-900/80 to-slate-900/90">
        <button
          className="p-1 hover:bg-slate-800 rounded-sm"
          onClick={(e) => {
            e.stopPropagation();
            onRename(file._id);
          }}
        >
          <Edit2 className="h-3.5 w-3.5 text-blue-400" />
        </button>
        <button
          className="p-1 hover:bg-slate-800 rounded-sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(file._id);
          }}
        >
          <Trash2 className="h-3.5 w-3.5 text-red-400" />
        </button>
      </div>
    </div>
  );
};

// Folder component with inline actions instead of dropdown
const FolderWithActions = ({
  file,
  children,
  onCreateFile,
  onCreateFolder,
  onRename,
  onDelete,
}: FolderWithActionsProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
                          onCreateFile(file._id);
                        }}
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
                          onCreateFolder(file._id);
                        }}
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
                          onRename(file._id);
                        }}
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
                          onDelete(file._id);
                        }}
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
        {children}
      </Folder>
    </div>
  );
};

export default function FileSystem(props: Props) {
  const { activeFileId, setActiveFileId } = props;
  const [createFile, setCreateFile] = useState<string>();
  const [createFolder, setCreateFolder] = useState<string>();
  const [deleteFileOrFolder, setDeleteFileOrFolder] = useState<string>();
  const [renameItem, setRenameItem] = useState<string>();

  const handleCreateFile = async (parentId: string) => {
    setCreateFile(parentId);
    console.log("Creating file in parent:", parentId);
  };

  const handleCreateFolder = async (parentId: string) => {
    setCreateFolder(parentId);
    console.log("Creating folder in parent:", parentId);
  };

  const handleDeleteFolderOrFile = async (fileId: string) => {
    setDeleteFileOrFolder(fileId);
    console.log("Deleting item:", fileId);
  };

  const handleRenameFile = async (fileId: string) => {
    setRenameItem(fileId);
    console.log("Renaming item:", fileId);
  };

  const handleFileClick = (fileId: string) => {
    setActiveFileId(fileId);
    console.log("File clicked:", fileId);
  };

  const getFileWithParentId = (parentId: string) => {
    const files = SampleFileSystem.filter((file) => file.parentId == parentId);

    if (files.length === 0) {
      return null;
    }

    const groupFiles = [
      ...files.filter((file) => file.type === "folder"),
      ...files.filter((file) => file.type !== "folder"),
    ];

    return groupFiles.map((file) => (
      <div key={file._id}>
        {file.type !== "folder" ? (
          <FileWithActions
            file={file}
            onClick={() => handleFileClick(file._id)}
            onRename={handleRenameFile}
            onDelete={handleDeleteFolderOrFile}
          />
        ) : (
          <FolderWithActions
            file={file}
            onCreateFile={handleCreateFile}
            onCreateFolder={handleCreateFolder}
            onRename={handleRenameFile}
            onDelete={handleDeleteFolderOrFile}
          >
            {getFileWithParentId(file._id)}
          </FolderWithActions>
        )}
      </div>
    ));
  };

  const getRoomFiles = () => {
    const rootItems = SampleFileSystem.filter((file) => file.parentId === null);

    // Arrage by file type like vs code
    const groupFiles = [
      ...rootItems.filter((file) => file.type === "folder"),
      ...rootItems.filter((file) => file.type !== "folder"),
    ];
    return groupFiles.map((file) => (
      <div key={file._id}>
        {file.type !== "folder" ? (
          <FileWithActions
            file={file}
            onClick={() => handleFileClick(file._id)}
            onRename={handleRenameFile}
            onDelete={handleDeleteFolderOrFile}
          />
        ) : (
          <FolderWithActions
            file={file}
            onCreateFile={handleCreateFile}
            onCreateFolder={handleCreateFolder}
            onRename={handleRenameFile}
            onDelete={handleDeleteFolderOrFile}
          >
            {getFileWithParentId(file._id)}
          </FolderWithActions>
        )}
      </div>
    ));
  };

  const handleRootActions = () => {
    return (
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => handleCreateFile(null as any)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
        >
          <FileText className="h-3.5 w-3.5 text-green-400" />
          <span>New File</span>
        </button>

        <button
          onClick={() => handleCreateFolder(null as any)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
        >
          <FolderPlus className="h-3.5 w-3.5 text-blue-400" />
          <span>New Folder</span>
        </button>
      </div>
    );
  };

  return (
    <div className="h-screen overflow-auto bg-slate-900/50 border border-slate-800 rounded-lg p-4">
      <h3 className="text-sm font-medium text-slate-300 mb-3 pl-2">
        Project Files
      </h3>
      {handleRootActions()}
      <Tree>{getRoomFiles()}</Tree>
    </div>
  );
}
