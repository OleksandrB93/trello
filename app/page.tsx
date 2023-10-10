import { BoardsList } from "@/components";
import { prisma } from "@/core/db";

export default async function Home() {
  const boards = await prisma.boards.findMany();

  return (
    <div className="container mx-auto">
      <BoardsList initialData={boards} />
    </div>
  );
}
