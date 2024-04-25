import { NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

export async function POST(req: Request) {
	const { email, name, image } = await req.json();
	const user: User[] = await prisma.$queryRaw`
    SELECT email from user
    WHERE email = ${email}
  `;
	if (user.length) {
		return NextResponse.json({ message: "User already exists" });
	}
	const newUser: User[] = await prisma.$queryRaw`
      INSERT INTO user (email, name, image)
      VALUES (${email}, ${name}, ${image})
    `;
	return NextResponse.json({ message: "User created", user: newUser[0] });
}

export async function GET() {
    return NextResponse.json({ message: "GET request" });
}