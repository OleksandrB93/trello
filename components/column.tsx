"use client";

import { MIN_WIDTH } from "@/helper/constants";
import { ColumnPayload, useColumnQuery } from "@/hooks/use-column-query";
import { useUpdateColumnMutation } from "@/hooks/use-update-column-mutation";
import { DragEvent, useEffect, useRef, useState } from "react";
import { Card, CreateCard } from "../components";

interface ColumnProps {
  column: ColumnPayload;
}

export function Column({ column }: ColumnProps) {
  const { data } = useColumnQuery({ initialData: column });

  const initialDragX = useRef<number>(0);
  const [width, setWidth] = useState(data.width);
  useEffect(() => {
    setWidth(data.width);
  }, [data.width]);

  const onResizeStart = (e: DragEvent<HTMLDivElement>) => {
    initialDragX.current = e.clientX;
  };

  const onResize = (e: DragEvent<HTMLDivElement>) => {
    if (e.clientX === 0) return;

    const movedBy = e.clientX - initialDragX.current;
    initialDragX.current = e.clientX;
    setWidth((width) => {
      const newWidth = width + movedBy;
      if (newWidth < MIN_WIDTH) return MIN_WIDTH;

      return newWidth;
    });
  };

  const { mutateAsync } = useUpdateColumnMutation();
  const onResizeEnd = async () => {
    await mutateAsync({ columnId: data.id, data: { width } });
  };

  return (
    <div
      style={{ minWidth: width, width }}
      className="block w-full h-fit border rounded-lg shadow bg-gray-800 border-t-0 border-gray-700 sticky top-0"
    >
      <div className="sticky top-0 bg-gray-800 border-t border-gray-700 rounded-t-lg">
        <h5 className="text-lg font-bold tracking-tight text-white sticky p-3">
          {data.title}
        </h5>
        <div
          className="absolute -right-px top-[0.5rem] bottom-[0.5rem] cursor-col-resize w-1  bg-gray-700 select-none opacity-100"
          draggable
          onDragStart={onResizeStart}
          onDrag={onResize}
          onDragEnd={onResizeEnd}
        />
      </div>
      <div>
        <div className="flex gap-2 flex-col pl-3 pr-2 mb-1.5 mr-0.5 max-h-[65vh] overflow-y-auto">
          {data.cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
        <CreateCard columnId={column.id} />
      </div>
    </div>
  );
}
