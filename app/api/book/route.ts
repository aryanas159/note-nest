import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prismaClient";

export async function POST(req: NextRequest) {
	try {
		const {
			book_title,
			user_email,
		}: { book_title: string; user_email: string } = await req.json();
		const newBook = await prisma.book.create({
			data: {
				book_title: book_title == "" ? "Untitled" : book_title,
				user_email,
			},
		});
		return NextResponse.json(
			{
				message: "Book added successfully",
				book: newBook,
			},
			{
				status: 201,
			}
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{
				message: "An error occurred",
			},
			{
				status: 500,
			}
		);
	}
}

export async function GET(req: NextRequest) {
	const user_email: string = req.nextUrl.searchParams.get("user_email") || "";
	try {
		const books = await prisma.$queryRaw`SELECT * FROM book 
        WHERE user_email = ${user_email}
        `;
		return NextResponse.json(
			{
				books,
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{
				message: "An error occurred",
			},
			{
				status: 500,
			}
		);
	}
}
export async function PUT(req: NextRequest) {
	const {
		book_id,
		book_title,
		user_email,
		book_description,
	}: {
		book_id: string;
		book_title: string;
		user_email: string;
		book_description: string;
	} = await req.json();
	try {
		await prisma.$queryRaw`
        UPDATE book
        SET book_title = ${book_title == "" ? "Untitled" : book_title},
		book_description = ${book_description}
        WHERE book_id = ${Number(book_id)} AND user_email = ${user_email}
        `;
		return NextResponse.json(
			{
				message: "Book updated successfully",
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{
				message: "An error occurred",
			},
			{
				status: 500,
			}
		);
	}
}

export async function DELETE(req: NextRequest) {
	const book_id: number = Number(req.nextUrl.searchParams.get("book_id") || "");
	const user_email: string = req.nextUrl.searchParams.get("user_email") || "";
	try {
		await prisma.$queryRaw`
		DELETE FROM book
		WHERE book_id = ${Number(book_id)} AND user_email = ${user_email}
		`;
		return NextResponse.json(
			{
				message: "Book deleted successfully",
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{
				message: "An error occurred",
			},
			{
				status: 500,
			}
		);
	}
}
