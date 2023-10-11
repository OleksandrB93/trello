"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useCreateColumnMutation } from "@/hooks/use-create-column-mutation";
import { Input } from "../components";

const createColumnSchema = z.object({
  title: z.string().min(1).max(20),
});

type CreateColumnValues = z.infer<typeof createColumnSchema>;

interface CreateColumnProps {
  boardId: string;
}

export function CreateColumn({ boardId }: CreateColumnProps) {
  const [isFormOpened, setIsFormOpened] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateColumnValues>({
    resolver: zodResolver(createColumnSchema),
  });

  const { mutateAsync } = useCreateColumnMutation({ boardId });

  const onSubmit = handleSubmit(async (values) => {
    await mutateAsync({
      ...values,
      boardId,
    });
    setIsFormOpened(false);
  });

  const openForm = () => setIsFormOpened(true);

  return (
    <div
      className="block sticky top-0 h-fit min-w-[10.5rem] w-[12.5rem] p-2 border rounded-lg shadow cursor-pointer bg-amber-600 border-amber-700 hover:bg-amber-500"
      onClick={openForm}
    >
      {isFormOpened ? (
        <form onSubmit={onSubmit}>
          <Input
            {...register("title")}
            placeholder="Enter your column title"
            error={errors.title?.message}
            disabled={isSubmitting}
          />
        </form>
      ) : (
        <h5 className="flex gap-x-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          <span>+</span> <span>Add a column</span>
        </h5>
      )}
    </div>
  );
}
