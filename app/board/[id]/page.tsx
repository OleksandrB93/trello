import { ColumnsList } from "@/components";
import { prisma } from "@/helper/db";
import { notFound } from "next/navigation";

interface PageParams {
  id: string;
}

interface PageProps {
  params: PageParams;
}

const BoardPage = async (props: PageProps) => {
  const board = await prisma.boards.findUnique({
    where: {
      id: props.params.id,
    },
    include: {
      columns: {
        orderBy: {
          order: "asc",
        },
        include: {
          cards: true,
        },
      },
    },
  });

  if (!board) {
    return notFound();
  }

  return (
    <>
      <ColumnsList board={board} />
    </>
  );
};

export default BoardPage;
