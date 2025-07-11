import "./ContentEditable.css";

import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import type { JSX } from "react";

export default function LexicalContentEditable({
  className,
}: {
  className?: string;
}): JSX.Element {
  return <ContentEditable className={className || "ContentEditable__root"} />;
}
