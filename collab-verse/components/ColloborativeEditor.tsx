"use client";

import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { useRoom } from "@liveblocks/react/suspense";
import { useCallback, useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import { Awareness } from "y-protocols/awareness";
// import { Cursors } from "./Cursor";
import { Toolbar } from "@/components/Toolbar";

// Collaborative code editor with undo/redo, live cursors, and live avatars
export function CollaborativeEditor() {
  const room = useRoom();
  const provider = getYjsProviderForRoom(room);
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();

  // Set up Liveblocks Yjs provider and attach Monaco editor
  useEffect(() => {
    let binding: MonacoBinding;

    if (editorRef) {
      const yDoc = provider.getYDoc();
      const yText = yDoc.getText("monaco");

      // Attach Yjs to Monaco
      binding = new MonacoBinding(
        yText,
        editorRef.getModel() as editor.ITextModel,
        new Set([editorRef]),
        provider.awareness as unknown as Awareness,
      );
    }

    return () => {
      binding?.destroy();
    };
  }, [editorRef, room]);

  const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
    setEditorRef(e);
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-black rounded-lg shadow-md overflow-hidden">
      {/* {provider ? <Cursors yProvider={provider} /> : null} */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
        <div>{editorRef ? <Toolbar editor={editorRef} /> : null}</div>
      </div>
      <div className="flex-1 min-h-0">
        <Editor
          onMount={handleOnMount}
          height="100%"
          width="100vw"
          theme="vs-light"
          defaultLanguage="typescript"
          defaultValue=""
          options={{
            tabSize: 2,
            padding: { top: 20 },
          }}
        />
      </div>
    </div>
  );
}
