// src/Tiptap.jsx
import { EditorProvider, FloatingMenu, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { EditorContent, useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";

// define your extension array
const extensions = [
  StarterKit,
  Highlight.configure({
    multicolor: true,
  }),
];

const Tiptap = ({
  initialValue,
  onChange,
  onFocus,
}: {
  initialValue: JSONContent;
  onChange: (json: JSONContent | null) => void;
  onFocus: () => void;
}) => {
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
    onFocus,
  });
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
      <EditorContent className="prose" editor={editor} />
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
import { z } from "zod";

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
