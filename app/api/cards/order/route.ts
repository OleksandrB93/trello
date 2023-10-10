import { NextResponse } from "next/server";
import { updateCardsOrderDto } from "../dto";
import { prisma } from "@/helper/db";

export async function PATCH(req: Request) {
  const bodyRaw = await req.json();
  const validateBody = updateCardsOrderDto.safeParse(bodyRaw);

  if (!validateBody.success) {
    return NextResponse.json(validateBody.error.issues, { status: 400 });
  }

  const queries = validateBody.data.map(({ id, order }) =>
    prisma.cards.update({
      where: {
        id,
      },
      data: {
        order,
      },
    })
  );

  await prisma.$transaction(queries);

  return NextResponse.json({}, { status: 200 });
}
