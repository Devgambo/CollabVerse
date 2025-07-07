import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate a random vivid color for user cursors
export function generateRandomColor(): string {
  // Use HSL to ensure vivid colors
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 60%)`;
}

const extLangMap: Record<string, string> = {
  py: "python",
  js: "javascript",
  ts: "typescript",
  java: "java",
  c: "c",
  cpp: "cpp",
  cs: "csharp",
  go: "go",
  rs: "rust",
  html: "html",
  css: "css",
  scss: "scss",
  less: "less",
  json: "json",
  md: "markdown",
  xml: "xml",
  yaml: "yaml",
  yml: "yaml",
  sh: "shell",
  sql: "sql",
  php: "php",
};

export function mapExtensionToLanguage(
  extension: string | undefined,
): string | undefined {
  if (!extension) {
    return undefined; // Or provide a sensible default
  }

  // Remove the dot if present
  const ext = extension.startsWith(".") ? extension.substring(1) : extension;

  return extLangMap[ext];
}
