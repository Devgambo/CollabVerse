import { editor } from "monaco-editor";
import * as Y from "yjs";

type Props = {
  editor: editor.IStandaloneCodeEditor;
};

export function Toolbar({ editor }: Props) {
  return (
    <div className="flex gap-2 p-2 bg-gray-100 rounded shadow">
      <button
        className="p-2 rounded hover:bg-gray-200 transition-colors"
        onClick={() => editor.trigger("", "undo", null)}
        aria-label="undo"
        type="button"
      >
        <UndoIcon />
      </button>
      <button
        className="p-2 rounded hover:bg-gray-200 transition-colors"
        onClick={() => editor.trigger("", "redo", null)}
        aria-label="redo"
        type="button"
      >
        <RedoIcon />
      </button>
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
