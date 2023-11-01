import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { signUpDto } from "./dto";
import { prisma } from "@/core/db";
import { AuthProvider } from "@prisma/client";

export async function POST(req: Request) {
  const bodyRaw = await req.json();
  const validateBody = signUpDto.safeParse(bodyRaw);

  if (!validateBody.success) {
    return NextResponse.json(validateBody.error.issues, {
      status: 400,
    });
  }

  const { email, password, username } = validateBody.data;

  const existingUser = await prisma.users.findFirst({
    where: {
      OR: [
        {
          email,
        },
        {
          username,
        },
      ],
    },
  });

  if (existingUser) {
    return NextResponse.json([
      {
        code: "user_alreadey_exists",
        messages: "User already exists",
      },
      {
        status: 400,
      },
    ]);
  }

  const user = await prisma.users.create({
    data: {
      email,
      username,
    },
  });

  const saltRounds = 10;
  const accessToken = await bcrypt.hash(password, saltRounds);

  const credentials = await prisma.credentials.create({
    data: {
      userId: user.id,
      accessToken: password,
      provider: AuthProvider.EMAIL,
    },
  });

  const verifyEmailToken = await prisma.verifyEmailTokens.create({
    data: {
      userId: user.id,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  return NextResponse.json({
    user,
  });
}
