import { type JSX, lazy } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { $isTextNode, type DOMConversionMap, TextNode } from "lexical";

import { FlashMessageContext } from "~/lib/lexical/packages/context/FlashMessageContext";
import {
  SettingsContext,
  useSettings,
} from "~/lib/lexical/packages/context/SettingsContext";
import { SharedHistoryContext } from "~/lib/lexical/packages/context/SharedHistoryContext";
import { ToolbarContext } from "~/lib/lexical/packages/context/ToolbarContext";
import PlaygroundNodes from "~/lib/lexical/packages/nodes/PlaygroundNodes";
import { TableContext } from "~/lib/lexical/packages/plugins/TablePlugin";
import { parseAllowedFontSize } from "~/lib/lexical/packages/plugins/ToolbarPlugin/fontSize";
import PlaygroundEditorTheme from "~/lib/lexical/packages/themes/PlaygroundEditorTheme";
import { parseAllowedColor } from "~/lib/lexical/packages/ui/ColorPicker";
import ClientOnly from "~/lib/lexical/utils/clientOnly";
import ReadOnlyContent from "~/lib/lexical/utils/ReadOnlyContent";

const Editor = lazy(() => import("../lib/lexical/Editor"));

function getExtraStyles(element: HTMLElement): string {
  // Parse styles from pasted input, but only if they match exactly the
  // sort of styles that would be produced by exportDOM
  let extraStyles = "";
  const fontSize = parseAllowedFontSize(element.style.fontSize);
  const backgroundColor = parseAllowedColor(element.style.backgroundColor);
  const color = parseAllowedColor(element.style.color);
  if (fontSize !== "" && fontSize !== "15px") {
    extraStyles += `font-size: ${fontSize};`;
  }
  if (backgroundColor !== "" && backgroundColor !== "rgb(255, 255, 255)") {
    extraStyles += `background-color: ${backgroundColor};`;
  }
  if (color !== "" && color !== "rgb(0, 0, 0)") {
    extraStyles += `color: ${color};`;
  }
  return extraStyles;
}

function buildImportMap(): DOMConversionMap {
  const importMap: DOMConversionMap = {};

  // Wrap all TextNode importers with a function that also imports
  // the custom styles implemented by the playground
  for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
    importMap[tag] = (importNode) => {
      const importer = fn(importNode);
      if (!importer) {
        return null;
      }
      return {
        ...importer,
        conversion: (element) => {
          const output = importer.conversion(element);
          if (
            output === null ||
            output.forChild === undefined ||
            output.after !== undefined ||
            output.node !== null
          ) {
            return output;
          }
          const extraStyles = getExtraStyles(element);
          if (extraStyles) {
            const { forChild } = output;
            return {
              ...output,
              forChild: (child, parent) => {
                const textNode = forChild(child, parent);
                if ($isTextNode(textNode)) {
                  textNode.setStyle(textNode.getStyle() + extraStyles);
                }
                return textNode;
              },
            };
          }
          return output;
        },
      };
    };
  }

  return importMap;
}

function App(): JSX.Element {
  const {
    settings: { isCollab },
  } = useSettings();
  const contentPath = "/fc3.lexical";

  const initialConfig = {
    editable: true, // NOTE: Re-enable this for `/dashboard`
    editorState: isCollab ? null : undefined,
    html: { import: buildImportMap() },
    namespace: "Playground",
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <TableContext>
          <ToolbarContext>
            {/* <header>
              <a href="https://lexical.dev" target="_blank" rel="noreferrer">
                <img src={logo} alt="Lexical Logo" />
              </a>
            </header> */}
            <div className="editor-shell">
              <ReadOnlyContent filePath={contentPath} />
              <Editor />
            </div>
            {/* <Settings /> */}
            {/* {getIsDevPlayground() ? <DocsPlugin /> : null}
            {getIsDevPlayground() ? <PasteLogPlugin /> : null}
            {getIsDevPlayground() ? <TestRecorderPlugin /> : null}
            {measureTypingPerf ? <TypingPerfPlugin /> : null} */}
          </ToolbarContext>
        </TableContext>
      </SharedHistoryContext>
    </LexicalComposer>
  );
}

export default function PlaygroundApp(): JSX.Element {
  return (
    <ClientOnly>
      {/* NOTE: Re-enable this for `/dashboard`*/}
      <SettingsContext>
        <FlashMessageContext>
          <App />
        </FlashMessageContext>
      </SettingsContext>
    </ClientOnly>
  );
}
