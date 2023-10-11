"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { Button, Dialog, MdxEditor } from "../components";
import Markdown from "react-markdown";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { boardContext } from "./providers/bord.provider";
import { useCardQuery } from "@/hooks/use-card-query";
import { useUpdateCardMutation } from "@/hooks/use-update-card-mutation";

export function CardDialog() {
  const mdxEditor = useRef<MDXEditorMethods>(null);

  const { selectedCard, selectCard } = useContext(boardContext);
  useEffect(() => {
    if (selectedCard) {
      openModal();
    }
  }, [selectedCard]);

  const [showMdxEditor, setShowMdxEditor] = useState(false);
  const handleDescriptionClick = () => {
    if (window.getSelection()?.toString().length !== 0) {
      return;
    }

    setShowMdxEditor(true);
  };

  const { data } = useCardQuery({ id: selectedCard });
  const { mutateAsync, isLoading } = useUpdateCardMutation();
  const handleSave = async () => {
    const markdown = mdxEditor.current?.getMarkdown();
    await mutateAsync({
      cardId: selectedCard!,
      data: {
        description: markdown,
      },
    });

    setShowMdxEditor(false);
  };

  let [isOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    if (isLoading) {
      return;
    }

    setIsOpen(false);
    setShowMdxEditor(false);
    setTimeout(() => {
      selectCard(null);
    }, 300);
  };
  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <Dialog isOpen={isOpen} closeModal={closeModal} title={data?.title || ""}>
      <p className="text-lg font-semibold mb-4">Description</p>
      <div className="mb-4 markdown-section">
        {showMdxEditor && (
          <div>
            <MdxEditor value={data?.description} ref={mdxEditor} />
            <Button onClick={handleSave} isLoading={isLoading}>
              Save
            </Button>
          </div>
        )}

        {!showMdxEditor && (
          <>
            {data?.description ? (
              <div onClick={handleDescriptionClick}>
                <Markdown>{data?.description || ""}</Markdown>
              </div>
            ) : (
              <p
                onClick={handleDescriptionClick}
                className="p-4 bg-gray-600 hover:bg-gray-500 cursor-pointer rounded-md"
              >
                Add more detailed description
              </p>
            )}
          </>
        )}
      </div>
    </Dialog>
  );
}
