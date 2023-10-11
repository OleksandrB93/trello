"use client";

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  MDXEditor,
  MDXEditorMethods,
  UndoRedo,
  headingsPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import { forwardRef } from "react";

interface MdxEditorProps {
  value?: string | null;
}

export const MdxEditor = forwardRef<MDXEditorMethods, MdxEditorProps>(
  function MdxEditor({ value }, ref) {
    return (
      <MDXEditor
        className="dark-theme dark-editor hover:bg-gray-700 rounded-md mb-2 transition-all duration-250 border border-gray-600"
        ref={ref}
        markdown={value || ""}
        plugins={[
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <CreateLink />
                <BoldItalicUnderlineToggles />
                <BlockTypeSelect />
              </>
            ),
          }),
          headingsPlugin(),
        ]}
      />
    );
  }
);
