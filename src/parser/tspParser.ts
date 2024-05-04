// src/parser/tspParser.ts
import fs from "fs";
import path from "path";

interface MetaPrompt {
  content: string;
  params: Record<string, string[]>;
}

export const parseTSPFile = (filePath: string): MetaPrompt => {
  const content = fs.readFileSync(filePath, "utf8");
  const regex = /\{\{([^}]+)\}\}/g; // Regex to find {{ ... }} blocks
  let match;

  let textContent = content;
  const params: Record<string, string[]> = {};

  while ((match = regex.exec(content)) !== null) {
    const key = match[1].trim();
    const parts = key.split(",").map((part) => part.trim());
    const paramName = parts.shift() || "";
    const dependencies = parts;

    textContent = textContent.replace(match[0], `\${${paramName}}`);
    params[paramName] = dependencies;
  }

  return {
    content: textContent,
    params,
  };
};
