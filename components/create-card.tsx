"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from ".";
import { useCreateCardMutation } from "@/hooks/use-create-card-mutation";
import { Button } from "./button";
// import { useCreateCardMutation } from "@/hooks/use-create-card-mutation";
// import { Button, Input } from ".";

const createCardSchema = z.object({
  title: z.string().min(1).max(20),
});

type CreateCardValues = z.infer<typeof createCardSchema>;

interface CreateCardProps {
  columnId: string;
}

export function CreateCard({ columnId }: CreateCardProps) {
  const [isFormOpened, setIsFormOpened] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateCardValues>({
    resolver: zodResolver(createCardSchema),
  });

  const { mutateAsync } = useCreateCardMutation({ columnId });

  const onSubmit = handleSubmit(async (values) => {
    await mutateAsync({
      ...values,
      columnId,
    });
    setIsFormOpened(false);
    reset({
      title: "",
    });
  });

  const openForm = () => setIsFormOpened(true);

  return (
    <div
      className="block p-1.5 text-base font-bold rounded-b-lg group cursor-pointer hover:shadow bg-amber-600 hover:bg-amber-500 transition duration-250 text-white"
      onClick={openForm}
    >
      {isFormOpened ? (
        <form
        onSubmit={onSubmit}
        className="relative">
          <Input
            {...register("title")}
            placeholder="Enter your card title"
            error={errors.title?.message}
            disabled={isSubmitting}
            // className="pr-20"
          />
          <Button
            size="xsmall"
            className="absolute right-[5px] top-[5px]"
            type="submit"
            isLoading={isSubmitting}
          >
            Create
          </Button>
        </form>
      ) : (
        <h5 className="flex justify-center text-lg font-bold tracking-tight text-gray-900 dark:text-white">
           <span className="mr-1">+</span> <span>Create a new card</span>
        </h5>
      )}
    </div>
  );
}
