import React from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

interface LatexRendererProps {
  text: string;
  throwOnError?: boolean;
}

const rethrowLatexError = (error: Error) => {
  throw error;
};

export function LatexRenderer({ text, throwOnError = false }: LatexRendererProps) {
  if (!text) return null;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  // Match block math $$...$$ or inline math $...$
  const regex = /\$\$([\s\S]+?)\$\$|\$([^\$]+?)\$/g;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      // Block math
      parts.push(
        <BlockMath key={key++} renderError={throwOnError ? rethrowLatexError : undefined}>
          {match[1]}
        </BlockMath>,
      );
    } else if (match[2]) {
      // Inline math
      parts.push(
        <InlineMath key={key++} renderError={throwOnError ? rethrowLatexError : undefined}>
          {match[2]}
        </InlineMath>,
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? <>{parts}</> : <>{text}</>;
}

export function renderLatex(text: string): React.ReactNode {
  return <LatexRenderer text={text} />;
}
