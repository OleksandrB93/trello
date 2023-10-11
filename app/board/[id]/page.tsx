import { ColumnsList } from "@/components";
import { CardDialog } from "@/components/card-dialog";
import { BoardProvider } from "@/components/providers/bord.provider";
import { prisma } from "@/core/db";
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
    <BoardProvider>
      <ColumnsList board={board} />
      <CardDialog />
    </BoardProvider>
  );
};

export default BoardPage;
