import React, { useEffect, useState } from "react";
import SampleFileSystem from "@/public/file_sys.json";
import { File, Folder, Tree } from "@/src/components/magicui/file-tree";
import {
  PlusCircle,
  FolderPlus,
  Trash2,
  Edit2,
  MoreVertical,
  FileText,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

interface Props {}

function FileSystem(props: Props) {
  const {} = props;
  const [activeFile, setActiveFile] = useState<String>();
  const [createFile, setCreateFile] = useState<String>();
  const [createFolder, setCreateFolder] = useState<String>();
  const [deleteFileOrFolder, setDeleteFileOrFolder] = useState<String>();
  const [renameItem, setRenameItem] = useState<String>();

  useEffect(() => {
    const handleActiveFIle = (fileId: String) => {
      setActiveFile(fileId);
    };
  }, [activeFile]);

  const handleCreateFile = async (parentId: String) => {
    setCreateFile(parentId);
    console.log("Creating file in parent:", parentId);
  };

  const handleCreateFolder = async (parentId: String) => {
    setCreateFolder(parentId);
    console.log("Creating folder in parent:", parentId);
  };

  const handleDeleteFolderOrFile = async (fileId: String) => {
    setDeleteFileOrFolder(fileId);
    console.log("Deleting item:", fileId);
  };

  const handleRenameFile = async (fileId: String) => {
    // New function stub for rename
    setRenameItem(fileId);
    console.log("Renaming item:", fileId);
  };

  const getFileWithParentId = (parentId: string) => {
    const files = SampleFileSystem.filter((file) => file.parentId == parentId);

    if (files.length === 0) {
      return null;
    }

    return files.map((file) => (
      <div key={file._id} className="group relative">
        {file.type !== "folder" && (
          <div className="flex items-center group">
            <File value={file._id}>{file.name}</File>

            {/* File actions */}
            <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <TooltipProvider>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none p-1 rounded-sm hover:bg-slate-700/60">
                      <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="bg-slate-800 border-slate-700 text-slate-200"
                  >
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameFile(file._id);
                      }}
                      className="flex items-center gap-2 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5 text-blue-400" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolderOrFile(file._id);
                      }}
                      className="flex items-center gap-2 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipProvider>
            </div>
          </div>
        )}

        {file.type === "folder" && (
          <div className="flex items-center group">
            <div className="flex-grow">
              <Folder value={file._id} element={file.name}>
                {getFileWithParentId(file._id)}
              </Folder>
            </div>

            {/* Folder actions */}
            <div className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
              <TooltipProvider>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none p-1 rounded-sm hover:bg-slate-700/60">
                      <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="bg-slate-800 border-slate-700 text-slate-200"
                  >
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateFile(file._id);
                      }}
                      className="flex items-center gap-2 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                    >
                      <FileText className="h-3.5 w-3.5 text-green-400" /> New
                      File
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateFolder(file._id);
                      }}
                      className="flex items-center gap-2 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                    >
                      <FolderPlus className="h-3.5 w-3.5 text-blue-400" /> New
                      Folder
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameFile(file._id);
                      }}
                      className="flex items-center gap-2 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5 text-yellow-400" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolderOrFile(file._id);
                      }}
                      className="flex items-center gap-2 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipProvider>
            </div>
          </div>
        )}
      </div>
    ));
  };

  const getRoomFiles = () => {
    const rootItems = SampleFileSystem.filter((file) => file.parentId === null);

    return rootItems.map((file) => (
      <div key={file._id} className="group relative">
        {file.type !== "folder" && (
          <div className="flex items-center group">
            <File value={file._id}>{file.name}</File>

            {/* File actions - same as above for root files */}
            <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <TooltipProvider>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none p-1 rounded-sm hover:bg-slate-700/60">
                      <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="bg-slate-800 border-slate-700 text-slate-200"
                  >
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameFile(file._id);
                      }}
                      className="flex items-center gap-2 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5 text-blue-400" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolderOrFile(file._id);
                      }}
                      className="flex items-center gap-2 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipProvider>
            </div>
          </div>
        )}

        {file.type === "folder" && (
          <div className="flex items-center group">
            <div className="flex-grow">
              <Folder value={file._id} element={file.name}>
                {getFileWithParentId(file._id)}
              </Folder>
            </div>

            <div className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
              <TooltipProvider>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none p-1 rounded-sm hover:bg-slate-700/60">
                      <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="bg-slate-800 border-slate-700 text-slate-200"
                  >
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateFile(file._id);
                      }}
                      className="flex items-center gap-2 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                    >
                      <FileText className="h-3.5 w-3.5 text-green-400" /> New
                      File
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateFolder(file._id);
                      }}
                      className="flex items-center gap-2 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                    >
                      <FolderPlus className="h-3.5 w-3.5 text-blue-400" /> New
                      Folder
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameFile(file._id);
                      }}
                      className="flex items-center gap-2 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5 text-yellow-400" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolderOrFile(file._id);
                      }}
                      className="flex items-center gap-2 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipProvider>
            </div>
          </div>
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

export default FileSystem;
