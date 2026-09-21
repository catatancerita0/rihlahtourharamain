/**
 * Article bodies are stored as blocks, because the public page renders lists and
 * notes differently from paragraphs. Editing blocks field by field would be
 * tedious, so the admin edits an outline and this module converts both ways.
 *
 * The outline is deliberately plain text rather than a rich text format: it
 * survives copy and paste from a document, it diffs readably, and it cannot
 * introduce markup the site would then have to sanitise.
 *
 *   ## Heading          a section heading
 *   - item              one list item, repeated for the rest of the list
 *   > note              a highlighted note
 *   anything else       a paragraph, one per blank-line separated block
 */
import type { ArticleBlock } from "../content/types";

export function blocksToText(blocks: ArticleBlock[]): string {
  const chunks: string[] = [];

  for (const block of blocks) {
    if (block.kind === "heading") chunks.push(`## ${block.text}`);
    else if (block.kind === "note") chunks.push(`> ${block.text}`);
    else if (block.kind === "list") chunks.push(block.items.map((item) => `- ${item}`).join("\n"));
    else chunks.push(block.text);
  }

  return chunks.join("\n\n");
}

export function textToBlocks(text: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];

  for (const chunk of text.split(/\n\s*\n/)) {
    const lines = chunk
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
    if (lines.length === 0) continue;

    if (lines.every((line) => line.startsWith("- "))) {
      const items = lines.map((line) => line.slice(2).trim()).filter((item) => item !== "");
      if (items.length > 0) blocks.push({ kind: "list", items });
      continue;
    }

    const first = lines[0];
    if (first.startsWith("## ")) {
      blocks.push({ kind: "heading", text: first.slice(3).trim() });
      continue;
    }
    if (first.startsWith("> ")) {
      blocks.push({ kind: "note", text: first.slice(2).trim() });
      continue;
    }

    // Anything else is a paragraph. Lines inside one block are joined, because a
    // paragraph typed with soft line breaks is still one paragraph.
    blocks.push({ kind: "paragraph", text: lines.join(" ") });
  }

  return blocks;
}
