export function getIsDevPlayground(): boolean {
  if (typeof window === "undefined") return false; // Safe default for SSR
  const hostName = window.location.hostname;
  return (
    // TODO: Update `hostName` for deployed urls
    hostName !== "playground.lexical.dev" &&
    hostName !== "lexical-playground.vercel.app"
  );
}

export const DEFAULT_SETTINGS = {
  disableBeforeInput: false,
  emptyEditor: getIsDevPlayground(),
  hasLinkAttributes: false,
  isAutocomplete: false,
  isCharLimit: false,
  isCharLimitUtf8: false,
  isCollab: false,
  isMaxLength: false,
  isRichText: true,
  listStrictIndent: false,
  measureTypingPerf: false,
  selectionAlwaysOnDisplay: false,
  shouldAllowHighlightingWithBrackets: false,
  shouldPreserveNewLinesInMarkdown: false,
  shouldUseLexicalContextMenu: false,
  showNestedEditorTreeView: false,
  showTableOfContents: false,
  showTreeView: true,
  tableCellBackgroundColor: true,
  tableCellMerge: true,
  tableHorizontalScroll: true,
} as const;

export const INITIAL_SETTINGS: Record<SettingName, boolean> = {
  ...DEFAULT_SETTINGS,
};

export type SettingName = keyof typeof DEFAULT_SETTINGS;

export type Settings = typeof INITIAL_SETTINGS;
