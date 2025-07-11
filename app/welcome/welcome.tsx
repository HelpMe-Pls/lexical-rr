import { LexicalComposer } from "@lexical/react/LexicalComposer";
import type { JSX } from "react";

import { SharedHistoryContext } from "~/lib/lexical/components//context/SharedHistoryContext";
import { FlashMessageContext } from "~/lib/lexical/components/context/FlashMessageContext";
import {
  SettingsContext,
  useSettings,
} from "~/lib/lexical/components/context/SettingsContext";
import { SharedAutocompleteContext } from "~/lib/lexical/components/context/SharedAutocompleteContext";
import { ToolbarContext } from "~/lib/lexical/components/context/ToolbarContext";
import PlaygroundNodes from "~/lib/lexical/components/nodes/PlaygroundNodes";
import DocsPlugin from "~/lib/lexical/components/plugins/DocsPlugin";
import PasteLogPlugin from "~/lib/lexical/components/plugins/PasteLogPlugin";
import { TableContext } from "~/lib/lexical/components/plugins/TablePlugin";
import { isDevPlayground } from "~/lib/lexical/components/settings/appSettings";
import Settings from "~/lib/lexical/components/settings/Settings";
import PlaygroundEditorTheme from "~/lib/lexical/components/themes/PlaygroundEditorTheme";
import { getPrepopulatedRichText } from "~/lib/lexical/components/utils/getPrepopulatedRichText";
import Editor from "~/lib/lexical/editor";

export default function LexicalEditor(): JSX.Element {
  const {
    settings: { emptyEditor },
  } = useSettings();

  const initialConfig = {
    editorState: emptyEditor ? undefined : getPrepopulatedRichText,
    namespace: "Playground",
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  return (
    <FlashMessageContext>
      <SettingsContext>
        <LexicalComposer initialConfig={initialConfig}>
          <SharedHistoryContext>
            <TableContext>
              <ToolbarContext>
                <SharedAutocompleteContext>
                  <div className="editor-shell">
                    <Editor />
                  </div>
                  <Settings />
                  {isDevPlayground ? <DocsPlugin /> : null}
                  {isDevPlayground ? <PasteLogPlugin /> : null}
                </SharedAutocompleteContext>
              </ToolbarContext>
            </TableContext>
          </SharedHistoryContext>
        </LexicalComposer>
      </SettingsContext>
    </FlashMessageContext>
  );
}
