"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../../docs.module.css";

type HighlightLanguage = "bash" | "ts" | "js" | "json" | "text";

type CodeTokenKind =
  | "plain"
  | "comment"
  | "string"
  | "keyword"
  | "number"
  | "property"
  | "function"
  | "command"
  | "flag"
  | "variable"
  | "operator"
  | "punctuation";

type CodeToken = {
  value: string;
  kind: CodeTokenKind;
};

const LANGUAGE_LABELS: Record<HighlightLanguage, string> = {
  bash: "Shell",
  ts: "TypeScript",
  js: "JavaScript",
  json: "JSON",
  text: "Plain text",
};

const LANGUAGE_ALIASES: Record<string, HighlightLanguage> = {
  bash: "bash",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  ts: "ts",
  tsx: "ts",
  typescript: "ts",
  js: "js",
  jsx: "js",
  javascript: "js",
  json: "json",
  text: "text",
  plaintext: "text",
  plain: "text",
};

const FILE_EXTENSION_LANGUAGE: Record<string, HighlightLanguage> = {
  bash: "bash",
  cjs: "js",
  js: "js",
  json: "json",
  mjs: "js",
  sh: "bash",
  ts: "ts",
  tsx: "ts",
  zsh: "bash",
};

const COMMAND_HINT =
  /^(?:pnpm|npm|yarn|bun|git|cd|npx|pnpx|node|curl|cp|mv|rm|mkdir|touch|echo|cat|sed|rg|find|ls|pwd)\b/;

const TOKEN_CLASS_NAMES: Record<CodeTokenKind, string> = {
  plain: styles.tokenPlain,
  comment: styles.tokenComment,
  string: styles.tokenString,
  keyword: styles.tokenKeyword,
  number: styles.tokenNumber,
  property: styles.tokenProperty,
  function: styles.tokenFunction,
  command: styles.tokenCommand,
  flag: styles.tokenFlag,
  variable: styles.tokenVariable,
  operator: styles.tokenOperator,
  punctuation: styles.tokenPunctuation,
};

function getFileExtension(filename?: string) {
  if (!filename) {
    return null;
  }

  const match = filename.toLowerCase().match(/\.([a-z0-9]+)$/);
  return match?.[1] ?? null;
}

function inferLanguage(
  content: string,
  language?: string,
  filename?: string
): HighlightLanguage {
  const normalized = language?.trim().toLowerCase();
  if (normalized && normalized in LANGUAGE_ALIASES) {
    return LANGUAGE_ALIASES[normalized];
  }

  const extension = getFileExtension(filename);
  if (extension && extension in FILE_EXTENSION_LANGUAGE) {
    return FILE_EXTENSION_LANGUAGE[extension];
  }

  const trimmed = content.trim();
  if (!trimmed) {
    return "text";
  }

  if (
    (trimmed.startsWith("{") || trimmed.startsWith("[")) &&
    /":\s*/.test(trimmed)
  ) {
    return "json";
  }

  if (
    trimmed
      .split("\n")
      .some((line) => COMMAND_HINT.test(line.trimStart()) || line.trimStart().startsWith("#"))
  ) {
    return "bash";
  }

  if (
    /\b(?:import|export|defineConfig|const|let|return|async|await)\b/.test(
      content
    )
  ) {
    return "ts";
  }

  return "text";
}

function pushToken(tokens: CodeToken[], value: string, kind: CodeTokenKind = "plain") {
  if (!value) {
    return;
  }

  tokens.push({ value, kind });
}

function tokenizeStructuredLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let rest = line;

  while (rest) {
    const whitespace = rest.match(/^\s+/)?.[0];
    if (whitespace) {
      pushToken(tokens, whitespace);
      rest = rest.slice(whitespace.length);
      continue;
    }

    const comment = rest.match(/^\/\/.*/)?.[0];
    if (comment) {
      pushToken(tokens, comment, "comment");
      break;
    }

    const quotedProperty = rest.match(/^"(?:\\.|[^"\\])*"(?=\s*:)/)?.[0];
    if (quotedProperty) {
      pushToken(tokens, quotedProperty, "property");
      rest = rest.slice(quotedProperty.length);
      continue;
    }

    const property = rest.match(/^[A-Za-z_$][\w$-]*(?=\s*:)/)?.[0];
    if (property) {
      pushToken(tokens, property, "property");
      rest = rest.slice(property.length);
      continue;
    }

    const stringToken = rest.match(
      /^"(?:\\.|[^"\\])*"|^'(?:\\.|[^'\\])*'|^`(?:\\.|[^`\\])*`/
    )?.[0];
    if (stringToken) {
      pushToken(tokens, stringToken, "string");
      rest = rest.slice(stringToken.length);
      continue;
    }

    const keyword = rest.match(
      /^(?:import|export|default|from|const|let|var|return|async|await|function|if|else|new|type|interface|true|false|null|undefined)\b/
    )?.[0];
    if (keyword) {
      pushToken(tokens, keyword, "keyword");
      rest = rest.slice(keyword.length);
      continue;
    }

    const number = rest.match(/^-?\d+(?:\.\d+)?\b/)?.[0];
    if (number) {
      pushToken(tokens, number, "number");
      rest = rest.slice(number.length);
      continue;
    }

    const fn = rest.match(/^[A-Za-z_$][\w$]*(?=\()/)?.[0];
    if (fn) {
      pushToken(tokens, fn, "function");
      rest = rest.slice(fn.length);
      continue;
    }

    const variable = rest.match(/^\$[A-Za-z_][\w$]*/)?.[0];
    if (variable) {
      pushToken(tokens, variable, "variable");
      rest = rest.slice(variable.length);
      continue;
    }

    const operator = rest.match(
      /^(?:=>|===|!==|==|!=|<=|>=|\.\.\.|[=:+\-*/%!?&|<>])/
    )?.[0];
    if (operator) {
      pushToken(tokens, operator, "operator");
      rest = rest.slice(operator.length);
      continue;
    }

    const punctuation = rest.match(/^[()[\]{}.,;]/)?.[0];
    if (punctuation) {
      pushToken(tokens, punctuation, "punctuation");
      rest = rest.slice(punctuation.length);
      continue;
    }

    const identifier = rest.match(/^[A-Za-z_$][\w$-]*/)?.[0];
    if (identifier) {
      pushToken(tokens, identifier);
      rest = rest.slice(identifier.length);
      continue;
    }

    pushToken(tokens, rest[0]);
    rest = rest.slice(1);
  }

  return tokens;
}

function tokenizeShellLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let rest = line;
  let expectCommand = true;

  while (rest) {
    const whitespace = rest.match(/^\s+/)?.[0];
    if (whitespace) {
      pushToken(tokens, whitespace);
      rest = rest.slice(whitespace.length);
      continue;
    }

    if (expectCommand) {
      const commandComment = rest.match(/^#.*/)?.[0];
      if (commandComment) {
        pushToken(tokens, commandComment, "comment");
        break;
      }
    }

    const quoted = rest.match(
      /^"(?:\\.|[^"\\])*"|^'(?:\\.|[^'\\])*'|^`(?:\\.|[^`\\])*`/
    )?.[0];
    if (quoted) {
      pushToken(tokens, quoted, "string");
      rest = rest.slice(quoted.length);
      expectCommand = false;
      continue;
    }

    const variable = rest.match(/^\$[A-Za-z_][\w$]*/)?.[0];
    if (variable) {
      pushToken(tokens, variable, "variable");
      rest = rest.slice(variable.length);
      expectCommand = false;
      continue;
    }

    const chainOperator = rest.match(/^(?:\|\||&&|[|><])/)?.[0];
    if (chainOperator) {
      pushToken(tokens, chainOperator, "operator");
      rest = rest.slice(chainOperator.length);
      expectCommand = true;
      continue;
    }

    const flag = rest.match(/^--?[A-Za-z][\w-]*/)?.[0];
    if (flag) {
      pushToken(tokens, flag, "flag");
      rest = rest.slice(flag.length);
      expectCommand = false;
      continue;
    }

    const punctuation = rest.match(/^[()[\]{}.,;]/)?.[0];
    if (punctuation) {
      pushToken(tokens, punctuation, "punctuation");
      rest = rest.slice(punctuation.length);
      continue;
    }

    const word = rest.match(/^[^\s"'`|&><()[\]{}.,;]+/)?.[0];
    if (word) {
      pushToken(tokens, word, expectCommand ? "command" : "plain");
      rest = rest.slice(word.length);
      expectCommand = false;
      continue;
    }

    pushToken(tokens, rest[0]);
    rest = rest.slice(1);
  }

  return tokens;
}

function tokenizeTextLine(line: string): CodeToken[] {
  return line ? [{ value: line, kind: "plain" }] : [];
}

function tokenizeLine(line: string, language: HighlightLanguage) {
  switch (language) {
    case "bash":
      return tokenizeShellLine(line);
    case "ts":
    case "js":
    case "json":
      return tokenizeStructuredLine(line);
    default:
      return tokenizeTextLine(line);
  }
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
}

export function DocsCodeBlock({
  content,
  language,
  filename,
  locale,
}: {
  content: string;
  language?: string;
  filename?: string;
  locale: string;
}) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const resolvedLanguage = inferLanguage(content, language, filename);
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const copyLabel = locale === "ko" ? "복사" : "Copy";
  const copiedLabel = locale === "ko" ? "복사됨" : "Copied";

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    const success = await copyText(content);
    if (!success) {
      return;
    }

    setCopied(true);

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  return (
    <div className={styles.codeWrap}>
      <div className={styles.codeHeader}>
        <div className={styles.codeHeaderMeta}>
          {filename ? (
            <span className={styles.codeFilename}>{filename}</span>
          ) : null}
          <span className={styles.codeLanguage}>{LANGUAGE_LABELS[resolvedLanguage]}</span>
        </div>

        <button
          type="button"
          className={`${styles.codeCopyButton} ${
            copied ? styles.codeCopyButtonActive : ""
          }`}
          onClick={handleCopy}
          aria-label={copied ? copiedLabel : copyLabel}
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>

      <pre className={styles.codeBlock}>
        <code className={styles.codeContent}>
          {lines.map((line, lineIndex) => {
            const tokens = tokenizeLine(line, resolvedLanguage);

            return (
              <span key={`${lineIndex}-${line}`} className={styles.codeLine}>
                <span className={styles.codeLineNumber} aria-hidden="true">
                  {String(lineIndex + 1).padStart(2, "0")}
                </span>
                <span className={styles.codeLineContent}>
                  {tokens.length > 0
                    ? tokens.map((token, tokenIndex) => (
                        <span
                          key={`${lineIndex}-${tokenIndex}-${token.value}`}
                          className={TOKEN_CLASS_NAMES[token.kind]}
                        >
                          {token.value}
                        </span>
                      ))
                    : "\u00A0"}
                </span>
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
