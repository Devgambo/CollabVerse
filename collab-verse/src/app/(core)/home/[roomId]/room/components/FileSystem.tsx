'use client'

import React, { useEffect, useState } from "react";
import { File, Folder, Tree } from "@/src/components/magicui/file-tree";
import { PlusCircle, FolderPlus, Trash2, Edit2, FileText, Check, X } from "lucide-react";
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

interface Props {
  roomId: ParamValue;
  activeFileId: string;
  setActiveFileId: (fileId: string) => void;
}

interface FileWithActionsProps {
  file: any;
  onClick: React.MouseEventHandler;
  onRename: (fileId: string) => void;
  onDelete: (fileId: string) => void;
  isRenaming: boolean;
  onRenameComplete: (fileId: string, newName: string) => void;
  onRenameCancel: () => void;
}

interface FolderWithActionsProps {
  file: any;
  children: React.ReactNode;
  onCreateFile: (parentId: string) => void;
  onCreateFolder: (parentId: string) => void;
  onRename: (fileId: string) => void;
  onDelete: (fileId: string) => void;
  isRenaming: boolean;
  onRenameComplete: (fileId: string, newName: string) => void;
  onRenameCancel: () => void;
}

export type FileSample = {
  _id: string;
  name: string;
  type: "folder" | "file";
  roomId: string;
  parentId: string | null;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
};


// File component with hover actions
const FileWithActions = ({
  file,
  onClick,
  onRename,
  onDelete,
  isRenaming,
  onRenameComplete,
  onRenameCancel,
}: FileWithActionsProps) => {
  const [renameValue, setRenameValue] = useState(file.name);
  const handleRenameSubmit = () => {
    if (renameValue.trim()) {
      onRenameComplete(file._id, renameValue.trim());
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      onRenameCancel();
    }
  };
  if (isRenaming) {
    return (
      <div className="flex items-center gap-1 py-0.5 pl-0.5 pr-2">
        <input
          type="text"
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-slate-800 text-white px-2 py-1 rounded text-sm border border-slate-600 focus:border-blue-400 focus:outline-none"
          autoFocus
        />
        <button
          onClick={handleRenameSubmit}
          className="p-1 hover:bg-slate-700 rounded-sm"
        >
          <Check className="h-3.5 w-3.5 text-green-400" />
        </button>
        <button
          onClick={onRenameCancel}
          className="p-1 hover:bg-slate-700 rounded-sm"
        >
          <X className="h-3.5 w-3.5 text-red-400" />
        </button>
      </div>
    );
  }

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
  isRenaming,
  onRenameComplete,
  onRenameCancel,
}: FolderWithActionsProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [renameValue, setRenameValue] = useState(file.name);

  const handleRenameSubmit = () => {
    if (renameValue.trim()) {
      onRenameComplete(file._id, renameValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      onRenameCancel();
    }
  };

  if (isRenaming) {
    return (
      <div className="flex items-center gap-1 py-1 px-2">
        <input
          type="text"
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-slate-800 text-white px-2 py-1 rounded text-sm border border-slate-600 focus:border-blue-400 focus:outline-none"
          autoFocus
        />
        <button
          onClick={handleRenameSubmit}
          className="p-1 hover:bg-slate-700 rounded-sm"
        >
          <Check className="h-3.5 w-3.5 text-green-400" />
        </button>
        <button
          onClick={onRenameCancel}
          className="p-1 hover:bg-slate-700 rounded-sm"
        >
          <X className="h-3.5 w-3.5 text-red-400" />
        </button>
      </div>
    );
  }

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

// New Item Input Component
const NewItemInput = ({
  type,
  onComplete,
  onCancel
}: {
  type: 'file' | 'folder';
  onComplete: (name: string, extension?: string) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState('');
  const [extension, setExtension] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onComplete(name.trim(), extension || undefined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="flex items-center gap-1 py-0.5 pl-0.5 pr-2 mb-2">
      <div className="flex items-center gap-1">
        {type === 'file' ? (
          <FileText className="h-4 w-4 text-green-400" />
        ) : (
          <FolderPlus className="h-4 w-4 text-blue-400" />
        )}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={type === 'file' ? 'filename' : 'folder name'}
          className="bg-slate-800 text-white px-2 py-1 rounded text-sm border border-slate-600 focus:border-blue-400 focus:outline-none"
          autoFocus
        />
        {type === 'file' && (
          <input
            type="text"
            value={extension}
            onChange={(e) => setExtension(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ext"
            className="bg-slate-800 text-white px-2 py-1 rounded text-sm border border-slate-600 focus:border-blue-400 focus:outline-none w-12"
          />
        )}
      </div>
      <button
        onClick={handleSubmit}
        className="p-1 hover:bg-slate-700 rounded-sm"
      >
        <Check className="h-3.5 w-3.5 text-green-400" />
      </button>
      <button
        onClick={onCancel}
        className="p-1 hover:bg-slate-700 rounded-sm"
      >
        <X className="h-3.5 w-3.5 text-red-400" />
      </button>
    </div>
  );
};

export default function FileSystem({ activeFileId, setActiveFileId, roomId }: Props) {
  const [createFile, setCreateFile] = useState<string | null>(null);
  const [createFolder, setCreateFolder] = useState<string | null>(null);
  const [renameItem, setRenameItem] = useState<string | null>(null);
  const { user } = useUser();
  const [fileSystem, setFileSystem] = useState<FileSample[]>([
    {
      "_id": "fs_001",
      "name": "sample.js",
      "type": "file",
      "roomId": "room_123",
      "parentId": null,
      "createdAt": 1704067200000,
      "updatedAt": 1704067200000,
      "createdBy": "user_abc123"
    }]
  )

  //TODO: handel fetching state with a loader
  const [fetchingFiles, setFetchingFiles] = useState(true);
  const createFileOrFolderFunc = useMutation(api.fileSystem.createFileOrFolder);
  const updateFileOrFolderFunc = useMutation(api.fileSystem.updateFileOrFolder);
  const deleteFileOrFolderFunc = useMutation(api.fileSystem.deleteFileOrFolder);

  useEffect(() => {
    console.log('hit');
    let ignore = false;
    const fetchFiles = async () => {
      try {
        console.log("insudeeeeeeeeetryyyyy")
        setFetchingFiles(true);
        const response = await fetch(`api/rooms/${roomId}/fileSystem`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("insudeeeeeeeeetryyyyy", response);
        const data = await response.json();
        console.log("DATAAAAAAAAAAA", data);
        if (!ignore) {
          setFileSystem(data.files);
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        if (!ignore) {
          setFetchingFiles(false);
        }
      }
    };
    
    fetchFiles();
    
    // Cleanup function to prevent race conditions
    return () => {
      ignore = true;
    };
  }, [roomId]); // Add roomId as dependency if it can change
  

  const handleCreateFile = async (parentId: string) => {
    setCreateFile(parentId);
    console.log("Creating file in parent:", parentId);
  };

  const handleCreateFolder = async (parentId: string) => {
    setCreateFolder(parentId);
    console.log("Creating folder in parent:", parentId);
  };

  const handleCreateComplete = async (name: string, extension?: string, type: 'file' | 'folder' = 'file') => {
    if (!user?.id) return;

    try {
      const parentId = type === 'file' ? createFile : createFolder;

      await createFileOrFolderFunc({
        name,
        roomId: roomId as string,
        parentId,
        type,
        extension,
        userId: user.id,
      });

      setCreateFile(null);
      setCreateFolder(null);
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const handleCreateCancel = () => {
    setCreateFile(null);
    setCreateFolder(null);
  };


  const handleDeleteFolderOrFile = async (fileId: string) => {
    if (!user?.id) return;

    try {
      await deleteFileOrFolderFunc({
        fileId,
        userId: user.id,
      });
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleRenameFile = async (fileId: string) => {
    setRenameItem(fileId);
    console.log("Renaming item:", fileId);
  };

  const handleRenameComplete = async (fileId: string, newName: string) => {
    if (!user?.id) return;

    try {
      await updateFileOrFolderFunc({
        fileId,
        name: newName,
        userId: user.id,
      });
      setRenameItem(null);
    } catch (error) {
      console.error('Error renaming item:', error);
    }
  };

  const handleRenameCancel = () => {
    setRenameItem(null);
  };

  const handleFileClick = (fileId: string) => {
    setActiveFileId(fileId);
    console.log("File clicked:", fileId);
  };

  const getFileWithParentId = (parentId: string) => {
    //TODO: change thisss
    const files = fileSystem.filter((file) => file.parentId == parentId);

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
            isRenaming={renameItem === file._id}
            onRenameComplete={handleRenameComplete}
            onRenameCancel={handleRenameCancel}
          />
        ) : (
          <FolderWithActions
            file={file}
            onCreateFile={handleCreateFile}
            onCreateFolder={handleCreateFolder}
            onRename={handleRenameFile}
            onDelete={handleDeleteFolderOrFile}
            isRenaming={renameItem === file._id}
            onRenameComplete={handleRenameComplete}
            onRenameCancel={handleRenameCancel}
          >
            {getFileWithParentId(file._id)}
          </FolderWithActions>
        )}
      </div>
    ));
  };

  const getRoomFiles = () => {

    //Change here too
    const rootItems = fileSystem.filter((file) => file.parentId === null);

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
            isRenaming={renameItem === file._id}
            onRenameComplete={handleRenameComplete}
            onRenameCancel={handleRenameCancel}
          />
        ) : (
          <FolderWithActions
            file={file}
            onCreateFile={handleCreateFile}
            onCreateFolder={handleCreateFolder}
            onRename={handleRenameFile}
            onDelete={handleDeleteFolderOrFile}
            isRenaming={renameItem === file._id}
            onRenameComplete={handleRenameComplete}
            onRenameCancel={handleRenameCancel}
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

  //TODO: Handle loading state
  if (fetchingFiles) {
    return (
      <div className="max-h-[80vh] overflow-auto bg-slate-900/50 border border-slate-800 rounded-lg p-4">
        <div className="text-slate-400 text-sm">Loading files...</div>
      </div>
    );
  }

  return (
    <div className="max-h-[80vh] overflow-auto bg-slate-900/50 border border-slate-800 rounded-lg p-4">
      {handleRootActions()}

      {/* Show create inputs */}
      {createFile === null && (
        <NewItemInput
          type="file"
          onComplete={(name, extension) => handleCreateComplete(name, extension, 'file')}
          onCancel={handleCreateCancel}
        />
      )}

      {createFolder === null && (
        <NewItemInput
          type="folder"
          onComplete={(name) => handleCreateComplete(name, undefined, 'folder')}
          onCancel={handleCreateCancel}
        />
      )}

      <Tree>{getRoomFiles()}</Tree>
    </div>
  );
}
