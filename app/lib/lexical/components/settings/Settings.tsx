import type { JSX } from "react";
import { useMemo, useState } from "react";

import { useSettings } from "../context/SettingsContext";
import Switch from "../ui/Switch";
import { isDevPlayground } from "./appSettings";

export default function Settings(): JSX.Element {
  const windowLocation = window.location;

  const {
    setOption,
    settings: {
      measureTypingPerf,
      isRichText,
      isMaxLength,
      isCharLimit,
      isCharLimitUtf8,
      isAutocomplete,
      showTreeView,
      showNestedEditorTreeView,
      disableBeforeInput,
      showTableOfContents,
      shouldUseLexicalContextMenu,
    },
  } = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [isSplitScreen, search] = useMemo(() => {
    const parentWindow = window.parent;
    const _search = windowLocation.search;
    const _isSplitScreen =
      parentWindow && parentWindow.location.pathname === "/split/";
    return [_isSplitScreen, _search];
  }, [windowLocation]);

  return (
    <>
      <button
        id="options-button"
        className={`editor-dev-button ${showSettings ? "active" : ""}`}
        onClick={() => setShowSettings(!showSettings)}
      />
      {showSettings ? (
        <div className="switches">
          {isDevPlayground && (
            <Switch
              onClick={() => {
                if (isSplitScreen) {
                  window.parent.location.href = `/${search}`;
                } else {
                  window.location.href = `/split/${search}`;
                }
              }}
              checked={isSplitScreen}
              text="Split Screen"
            />
          )}
          <Switch
            onClick={() => setOption("measureTypingPerf", !measureTypingPerf)}
            checked={measureTypingPerf}
            text="Measure Perf"
          />
          <Switch
            onClick={() => setOption("showTreeView", !showTreeView)}
            checked={showTreeView}
            text="Debug View"
          />
          <Switch
            onClick={() =>
              setOption("showNestedEditorTreeView", !showNestedEditorTreeView)
            }
            checked={showNestedEditorTreeView}
            text="Nested Editors Debug View"
          />
          <Switch
            onClick={() => {
              setOption("isRichText", !isRichText);
            }}
            checked={isRichText}
            text="Rich Text"
          />
          <Switch
            onClick={() => setOption("isCharLimit", !isCharLimit)}
            checked={isCharLimit}
            text="Char Limit"
          />
          <Switch
            onClick={() => setOption("isCharLimitUtf8", !isCharLimitUtf8)}
            checked={isCharLimitUtf8}
            text="Char Limit (UTF-8)"
          />
          <Switch
            onClick={() => setOption("isMaxLength", !isMaxLength)}
            checked={isMaxLength}
            text="Max Length"
          />
          <Switch
            onClick={() => setOption("isAutocomplete", !isAutocomplete)}
            checked={isAutocomplete}
            text="Autocomplete"
          />
          <Switch
            onClick={() => {
              setOption("disableBeforeInput", !disableBeforeInput);
              setTimeout(() => window.location.reload(), 500);
            }}
            checked={disableBeforeInput}
            text="Legacy Events"
          />
          <Switch
            onClick={() => {
              setOption("showTableOfContents", !showTableOfContents);
            }}
            checked={showTableOfContents}
            text="Table Of Contents"
          />
          <Switch
            onClick={() => {
              setOption(
                "shouldUseLexicalContextMenu",
                !shouldUseLexicalContextMenu
              );
            }}
            checked={shouldUseLexicalContextMenu}
            text="Use Lexical Context Menu"
          />
        </div>
      ) : null}
    </>
  );
}
