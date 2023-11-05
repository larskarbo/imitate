// src/Tiptap.jsx
import { BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import Highlight from "@tiptap/extension-highlight";
import { EditorContent, useEditor } from "@tiptap/react";

// define your extension array
const extensions = [
  StarterKit,
  Highlight.configure({
    multicolor: true,
  }),
];

// Define highlight colors
const highlightColors = {
  yellow: "#eded98",
  green: "#9fed98",
  purple: "#ddc4f2",
};
const Tiptap = ({
  initialValue,
  onChange,
  onFocus,
}: {
  initialValue: JSONContent;
  onChange: (json: JSONContent | null) => void;
  onFocus: () => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [...extensions],
    content: initialValue,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      if (editor.isEmpty) {
        onChange(null);
      } else {
        onChange(json);
      }
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
    onFocus: () => {
      setIsFocused(true);
      onFocus();
    },
    onBlur: () => {
      setIsFocused(false);
    },
  });

  const keyboardShortcutHandler = (event, color) => {
    if (!isFocused || !event.ctrlKey) return;

    event.preventDefault();
    editor?.chain().focus().toggleHighlight({ color }).run();
  };

  useKeypress(
    "1",
    (e) => {
      keyboardShortcutHandler(e, highlightColors.yellow);
    },
    [isFocused]
  );

  useKeypress(
    "2",
    (e) => {
      keyboardShortcutHandler(e, highlightColors.green);
    },
    [isFocused]
  );

  useKeypress(
    "3",
    (e) => {
      keyboardShortcutHandler(e, highlightColors.purple);
    },
    [isFocused]
  );

  useKeypress(
    "x",
    (e) => {
      if (!e.metaKey || !e.shiftKey) return;

      editor?.commands.toggleStrike();
    },
    [isFocused]
  );

  return (
    <>
      {editor && (
        <BubbleMenu
          className="bg-white p-2"
          editor={editor}
          tippyOptions={{ duration: 100 }}
        >
          <button
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .toggleHighlight({
                  color: "#eded98",
                })
                .run()
            }
          >
            yellow
          </button>
          <button
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .toggleHighlight({
                  color: "#9fed98",
                })
                .run()
            }
          >
            green
          </button>
          <button
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .toggleHighlight({
                  color: "#ddc4f2",
                })
                .run()
            }
          >
            purple
          </button>
        </BubbleMenu>
      )}
      <EditorContent
        className="prose prose-sm w-full  prose-zinc "
        editor={editor}
      />
    </>
  );
};

export default Tiptap;

export const textToDoc = (text: string): JSONContent => {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: text,
          },
        ],
      },
    ],
  };
};

import type { JSONContent } from "@tiptap/core";
import { isObject } from "lodash";
import { useState } from "react";
import { z } from "zod";
import useKeypress from "./utils/useKeyPress";

export const isDoc = (
  maybeDoc: unknown | JSONContent
): maybeDoc is JSONContent => {
  if (
    maybeDoc &&
    isObject(maybeDoc) &&
    (maybeDoc as JSONContent).type === "doc"
  ) {
    return true;
  }
  return false;
};

export const zodTiptapDoc = z.unknown().refine(isDoc);

export const docToText = (content: JSONContent) => {
  const html = generateHTML(content, extensions);

  return htmlToText(html, {
    ignoreHref: true,
  });
};

import { generateHTML } from "@tiptap/html";
import { htmlToText } from "html-to-text";

