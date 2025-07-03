"use client";

import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { useRoom } from "@liveblocks/react/suspense";
import {
  useCallback,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import { Awareness } from "y-protocols/awareness";
import { Cursors } from "./Cursors";
import { Toolbar } from "@/src/app/(core)/home/[roomId]/room/components/Toolbar";
import { CODE_SNIPPETS } from "@/src/lib/constants";

type CollaborativeEditorProps = {
  leftSide: boolean;
  rightSide: boolean;
  setLeftSide: Dispatch<SetStateAction<boolean>>;
  setRightSide: Dispatch<SetStateAction<boolean>>;
  fileId: string;
  permissions: string[];
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
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [selectedTheme, setSelectedTheme] = useState("vs-dark");
  const [updatedCode, setUpdatedCode] = useState(
    "//Select a file to start coding..!",
  );
  const themes = [
    { name: "Dark", value: "vs-dark" },
    { name: "Light", value: "light" },
    { name: "High Contrast", value: "hc-black" },
  ];

  const fetchFileContent = async () => {
    
  };

  useEffect(() => {
    if (fileId) {
      //file Id --> filecontent and fill content
      fetchFileContent();
    }
  }, [fileId]);

  useEffect(() => {
    if (permissions.includes("write")) {
      setIsWrite(true);
    } else {
      setIsWrite(false);
    }

    // Update editor options when isWrite changes
    if (editorRef) {
      editorRef.updateOptions({
        readOnly: !isWrite,
      });
    }
  }, [permissions, isWrite, editorRef]);

  const onSelect = (codeLanguage: string) => {
    setCodeLanguage(codeLanguage);
  };

  const handleEditorChange = (value: string | undefined) => {
    setUpdatedCode(value || "");
    //TODO: autosave to persist the data
  };

  const autoSaveFile = async (content: string) => {
    // if (!file?.id || !file?.workspaceId) return;

    try {
      //TODO: implement autosave
    } catch (error) {
      console.error("Error auto-saving file:", error);
    }
  };

  useEffect(() => {
    let binding: MonacoBinding;
    if (editorRef) {
      const yDoc = provider.getYDoc();
      const yText = yDoc.getText("monaco");

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

    // Configure editor theme and options after mount
    e.updateOptions({
      theme: "vs-dark",
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
  }, []);

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
          defaultValue={
            CODE_SNIPPETS[codeLanguage as keyof typeof CODE_SNIPPETS] ||
            CODE_SNIPPETS.javascript
          }
          value={updatedCode}
          // onMount={onMount}
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
