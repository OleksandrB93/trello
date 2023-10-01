import { BoardCard } from "@/components";
import { prisma } from "@/prisma/db";

const Home = async () => {
  const boards = await prisma.boards.findMany();
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">
        {boards.map(({ title, id }) => (
          <BoardCard key={id} title={title} id={id} />
        ))}
      </div>
    </div>
  );
};

export default Home;
