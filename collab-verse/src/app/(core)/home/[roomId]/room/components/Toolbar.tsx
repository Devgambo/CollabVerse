import { Outdent, SidebarClose, SidebarIcon } from "lucide-react";
import { editor } from "monaco-editor";
import * as Y from "yjs";
import { Dispatch, SetStateAction } from "react";

type Props = {
  editor: editor.IStandaloneCodeEditor;
  leftSide: boolean;
  rightSide: boolean;
  setLeftSide: Dispatch<SetStateAction<boolean>>;
  setRightSide: Dispatch<SetStateAction<boolean>>;
};

export function Toolbar({
  editor,
  leftSide,
  rightSide,
  setLeftSide,
  setRightSide,
}: Props) {
  return (
    <div className="flex gap-1 justify-between align-middle items-center bg-[#1c2128] border-b border-gray-700/50 px-3 py-2">
      <div className="flex gap-1">
        <button
          className={`p-2 rounded-md transition-colors duration-200 ${
            leftSide
              ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
          }`}
          onClick={() => setLeftSide(!leftSide)}
          aria-label="toggle left sidebar"
          type="button"
        >
          <SidebarIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-600/50 mx-1 my-auto"></div>

        <button
          className="p-2 rounded-md hover:bg-gray-700/50 transition-colors duration-200 text-gray-400 hover:text-gray-200"
          onClick={() => editor.trigger("", "undo", null)}
          aria-label="undo"
          type="button"
        >
          <UndoIcon />
        </button>
        <button
          className="p-2 rounded-md hover:bg-gray-700/50 transition-colors duration-200 text-gray-400 hover:text-gray-200"
          onClick={() => editor.trigger("", "redo", null)}
          aria-label="redo"
          type="button"
        >
          <RedoIcon />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">
          {leftSide && rightSide
            ? "Both panels open"
            : leftSide
              ? "Left panel open"
              : rightSide
                ? "Right panel open"
                : "Full editor"}
        </span>

        <div className="w-px h-6 bg-gray-600/50"></div>

        <button
          className={`p-2 rounded-md transition-colors duration-200 ${
            rightSide
              ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
          }`}
          onClick={() => setRightSide(!rightSide)}
          aria-label="toggle right sidebar"
          type="button"
        >
          <SidebarClose className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function UndoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6h6a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H8.91"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M5.5 3.5 3 6l2.5 2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function RedoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 6H6a3 3 0 0 0-3 3v0a3 3 0 0 0 3 3h1.09"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M10.5 3.5 13 6l-2.5 2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
