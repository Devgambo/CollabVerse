"use client";

import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { useRoom } from "@liveblocks/react/suspense";
import {
  useCallback,
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import { Awareness } from "y-protocols/awareness";
import { Cursors } from "./Cursors";
import { Toolbar } from "@/src/components/code-editor-components/Toolbar";
import { CODE_SNIPPETS } from "@/src/lib/constants";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

type CollaborativeEditorProps = {
  leftSide: boolean;
  rightSide: boolean;
  setLeftSide: Dispatch<SetStateAction<boolean>>;
  setRightSide: Dispatch<SetStateAction<boolean>>;
  fileId: string;
  permissions: string[];
};

export type sampleFileContent = {
  _id: string;
  _creationTime: number;
  fileId: string;
  content?: string;
  language?: string;
  output?: string;
  error?: string;
  executionTime?: number;
  createdAt: number;
  updatedAt: number;
};

export function CollaborativeEditor({
  leftSide,
  rightSide,
  setLeftSide,
  setRightSide,
  fileId,
  permissions,
}: CollaborativeEditorProps) {
  const room = useRoom();
  const provider = getYjsProviderForRoom(room);
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();
  const [isWrite, setIsWrite] = useState<boolean>(false);
  const [codeLanguage, setCodeLanguage] = useState<string>("typescript"); // Default to typescript
  const selectedTheme = "vs-dark";
  const [editorContent, setEditorContent] = useState<string>("");
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  // Keep track of the previous fileId to handle file switching
  const prevFileIdRef = useRef<string>("");
  const prevContentRef = useRef<string>("");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Store current language to ensure it doesn't change during saves
  const fileLanguageRef = useRef<string>("typescript");

  // Queries and mutations
  const fetchContent = useQuery(api.fileSystem.getFileContent, { fileId });
  const saveContent = useMutation(api.fileSystem.saveFileContent);

  // Debounced save function - now preserves the original language
  const debouncedSave = useCallback(
    (content: string, targetFileId: string) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          // Only send content in debounced save, keep language as is
          await saveContent({
            fileId: targetFileId,
            content: content,
            // Don't pass language here to avoid overwriting it
          });
        } catch (error) {
          console.error("Failed to save content:", error);
          toast.error("Failed to save file content");
        }
      }, 1000); // 1 second debounce
    },
    [saveContent],
  );

  // Handle file switching - save current content and load new content
  useEffect(() => {
    const handleFileSwitch = async () => {
      if (
        prevFileIdRef.current &&
        prevFileIdRef.current !== fileId &&
        prevContentRef.current
      ) {
        try {
          // Save the previous file's content immediately
          await saveContent({
            fileId: prevFileIdRef.current,
            content: prevContentRef.current,
            // Don't pass language to avoid overwriting
          });
        } catch (error) {
          console.error("Failed to save previous file:", error);
          toast.error("Failed to save previous file");
        }
      }

      // Update the previous file reference
      prevFileIdRef.current = fileId;
      setInitialLoad(true); // Mark as initial load for the new file
    };

    if (fileId) {
      handleFileSwitch();
    }
  }, [fileId, saveContent]);

  // Load file content when fileId changes or content is fetched
  useEffect(() => {
    if (
      fetchContent?.success &&
      Array.isArray(fetchContent.data) &&
      fetchContent.data.length > 0
    ) {
      const fileContentData = fetchContent.data[0] as sampleFileContent;
      const content = fileContentData.content || "// Start your coding journey";

      // Get language from file content data, with fallback to current language
      const language = fileContentData.language || fileLanguageRef.current;
      fileLanguageRef.current = language; // Store the language reference

      setEditorContent(content);
      setCodeLanguage(language);
      prevContentRef.current = content;

      // Update editor content if editor is ready
      if (editorRef && editorRef.getValue() !== content) {
        editorRef.setValue(content);
      }
    } else if (fetchContent?.success === false) {
      // File has no content yet, set default
      const defaultContent =
        CODE_SNIPPETS[fileLanguageRef.current as keyof typeof CODE_SNIPPETS] ||
        "// Start your coding journey";
      setEditorContent(defaultContent);
      prevContentRef.current = defaultContent;

      if (editorRef) {
        editorRef.setValue(defaultContent);
      }
    }
  }, [fetchContent, fileId, editorRef]);

  // Handle editor content changes
  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined) {
        setEditorContent(value);
        prevContentRef.current = value;

        // Only save if user has write permissions
        if (isWrite && fileId) {
          debouncedSave(value, fileId);
        }
      }
    },
    [isWrite, fileId, debouncedSave],
  );

  // Handle permissions
  useEffect(() => {
    const hasWritePermission = permissions.includes("write");
    setIsWrite(hasWritePermission);

    // Update editor options when permissions change
    if (editorRef) {
      editorRef.updateOptions({
        readOnly: !hasWritePermission,
      });
    }
  }, [permissions, editorRef]);

  // Handle Monaco binding for collaborative editing
  useEffect(() => {
    let binding: MonacoBinding;

    if (editorRef && provider) {
      const yDoc = provider.getYDoc();
      const yText = yDoc.getText(`monaco-${fileId}`); // Use fileId specific text..So that it can have seperate space

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
  }, [editorRef, provider, fileId]);

  // Handle editor mount
  const handleOnMount = useCallback(
    (editor: editor.IStandaloneCodeEditor) => {
      setEditorRef(editor);

      // Set initial content
      if (editorContent) {
        editor.setValue(editorContent);
      }

      // Configure editor options
      editor.updateOptions({
        readOnly: !isWrite,
        fontSize: 14,
        fontFamily: "JetBrains Mono, Consolas, Monaco, monospace",
        lineHeight: 1.6,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        automaticLayout: true,
        padding: { top: 16, bottom: 16 },
        renderWhitespace: "selection",
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        smoothScrolling: true,
        folding: true,
        foldingHighlight: true,
        bracketPairColorization: { enabled: true },
        guides: {
          bracketPairs: true,
          indentation: true,
        },
      });
    },
    [editorContent, isWrite],
  );

  // Handle language changes - only for initial load
  useEffect(() => {
    if (initialLoad && fileId && fileLanguageRef.current) {
      setInitialLoad(false);

      // On initial load, update the file with the correct language
      const updateLanguage = async () => {
        try {
          await saveContent({
            fileId: fileId,
            language: fileLanguageRef.current,
          });
        } catch (error) {
          console.error("Failed to update language:", error);
        }
      };

      updateLanguage();
    }
  }, [initialLoad, fileId, saveContent]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // const themes = [
  //   { name: "Dark", value: "vs-dark" },
  //   { name: "Light", value: "light" },
  //   { name: "High Contrast", value: "hc-black" },
  // ];

  return (
    <div className="h-full w-full bg-[#0d1117] flex flex-col">
      {/* Cursors overlay */}
      {provider && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <Cursors yProvider={provider} />
        </div>
      )}

      {/* Toolbar */}
      <div className="flex-none">
        {editorRef && (
          <Toolbar
            editor={editorRef}
            leftSide={leftSide}
            rightSide={rightSide}
            setLeftSide={setLeftSide}
            setRightSide={setRightSide}
          />
        )}
      </div>

      {/* Editor Container */}
      <div className="flex-1 relative bg-[#0d1117] overflow-hidden">
        <Editor
          onMount={handleOnMount}
          height="100%"
          width="100%"
          theme={selectedTheme}
          language={codeLanguage}
          value={editorContent}
          onChange={handleEditorChange}
          options={{
            tabSize: 2,
            insertSpaces: true,
            detectIndentation: true,
            trimAutoWhitespace: true,
            fontSize: 14,
            fontFamily: "JetBrains Mono, Consolas, Monaco, monospace",
            lineHeight: 1.6,
            minimap: {
              enabled: true,
              maxColumn: 80,
              renderCharacters: false,
            },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            automaticLayout: true,
            padding: {
              top: 16,
              bottom: 16,
            },
            renderWhitespace: "selection",
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            folding: true,
            foldingHighlight: true,
            showFoldingControls: "always",
            bracketPairColorization: {
              enabled: true,
              independentColorPoolPerBracketType: true,
            },
            guides: {
              bracketPairs: true,
              bracketPairsHorizontal: true,
              highlightActiveBracketPair: true,
              indentation: true,
              highlightActiveIndentation: true,
            },
            suggest: {
              showKeywords: true,
              showSnippets: true,
              showClasses: true,
              showFunctions: true,
              showVariables: true,
            },
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false,
            },
            acceptSuggestionOnEnter: "on",
            acceptSuggestionOnCommitCharacter: true,
            snippetSuggestions: "top",
            emptySelectionClipboard: false,
            copyWithSyntaxHighlighting: true,
            useTabStops: true,
            linkedEditing: true,
            occurrencesHighlight: "singleFile",
            selectionHighlight: true,
            hover: {
              enabled: true,
              delay: 300,
              sticky: true,
            },
            parameterHints: {
              enabled: true,
              cycle: true,
            },
            colorDecorators: true,
            codeLens: true,
            contextmenu: true,
            mouseWheelZoom: true,
            multiCursorModifier: "ctrlCmd",
            accessibilitySupport: "auto",
            find: {
              cursorMoveOnType: true,
              seedSearchStringFromSelection: "always",
              autoFindInSelection: "multiline",
            },
          }}
          loading={
            <div className="h-full w-full flex items-center justify-center bg-[#0d1117] text-white">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-300 text-sm">
                  Loading Monaco Editor...
                </p>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
