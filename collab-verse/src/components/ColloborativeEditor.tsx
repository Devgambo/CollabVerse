"use client";

import * as Y from "yjs";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { useRoom } from "@liveblocks/react/suspense"; // Use suspense version explicitly
import { useCallback, useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { MonacoBinding } from "y-monaco";
// Removed direct import of Awareness to avoid type mismatch

// Collaborative text editor with simple rich text, live cursors, and live avatars
export function CollaborativeEditor() {
  const [editorRef, setEditorRef] =
    useState<editor.IStandaloneCodeEditor | null>(null);
  const room = useRoom();
  const yProvider = getYjsProviderForRoom(room);

  // Set up Liveblocks Yjs provider and attach Monaco editor
  useEffect(() => {
    let binding: MonacoBinding | null = null;

    if (editorRef) {
      try {
        const yDoc = yProvider.getYDoc();
        const yText = yDoc.getText("monaco");
        const model = editorRef.getModel();

        if (model) {
          // Attach Yjs to Monaco
          // Cast awareness to the correct type to resolve type mismatch
          binding = new MonacoBinding(
            yText,
            model,
            new Set([editorRef]),
            yProvider.awareness as unknown as import("y-protocols/awareness").Awareness,
          );
        }
      } catch (error) {
        console.error("Error setting up Monaco binding:", error);
      }
    }

    return () => {
      try {
        binding?.destroy();
      } catch (error) {
        console.error("Error destroying binding:", error);
      }
    };
  }, [editorRef, yProvider]);

  const handleOnMount = useCallback((editor: editor.IStandaloneCodeEditor) => {
    setEditorRef(editor);
  }, []);

  return (
    <Editor
      onMount={handleOnMount}
      height="calc(100vh - 56px)" // Subtract navbar height
      width="100%"
      theme="vs-dark"
      defaultLanguage="typescript"
      defaultValue="// Start coding here..."
      options={{
        tabSize: 2,
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        automaticLayout: true,
      }}
    />
  );
}
