import {
  editorStateFromSerializedDocument,
  type SerializedDocument,
} from "@lexical/file";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

function ReadOnlyContent({ filePath }: { filePath: string }): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // This effect runs once on component mount to load the initial state.
    if (!filePath) {
      return;
    }

    let isMounted = true;

    const loadContent = async () => {
      try {
        // TODO: Update this to load the value of `richTextJson`
        const response = await fetch(filePath);
        if (!response.ok) {
          console.error(`Error fetching file: ${response.statusText}`);
          return;
        }
        const data: SerializedDocument = await response.json();

        if (isMounted) {
          // Create a Lexical EditorState from the serialized document.
          const editorState = editorStateFromSerializedDocument(editor, data);
          // Set the editor's state with the new content.
          editor.setEditorState(editorState);
        }
      } catch (error) {
        console.error("Failed to load initial editor content:", error);
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, [editor, filePath]); // Rerun if the editor or filePath changes.

  return null; // This plugin does not render any UI.
}

export default ReadOnlyContent;
