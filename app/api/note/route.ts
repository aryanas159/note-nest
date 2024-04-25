import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prismaClient";

export async function POST(req: NextRequest) {
	try {
		const { note_title, book_id }: { note_title: string; book_id: number } =
			await req.json();
		const newNote = await prisma.note.create({
			data: {
				note_title: note_title == "" ? "Untitled" : note_title,
				book_id,
			},
		});
		return NextResponse.json({ note: newNote }, { status: 200 });
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
	const book_id: number = parseInt(
		req.nextUrl.searchParams.get("book_id") || ""
	);
	const note_id: number = parseInt(
		req.nextUrl.searchParams.get("note_id") || ""
	);
	if (note_id) {
		try {
			const note = await prisma.note.findUnique({
				where: {
					note_id,
				},
			});
			return NextResponse.json({ note }, { status: 200 });
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
	try {
		const notes: Note[] = await prisma.$queryRaw`
        SELECT * FROM note WHERE book_id = ${book_id}
        `;
		return NextResponse.json({ notes }, { status: 200 });
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
	try {
		const {
			note_id,
			note_title,
			note_body,
		}: {
			note_id: number;
			note_title: string;
			note_body: string;
		} = await req.json();
		const updatedNote = await prisma.note.update({
			where: {
				note_id,
			},
			data: {
				note_title,
				note_body,
			},
		});
		return NextResponse.json({ note: updatedNote }, { status: 200 });
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
	try {
		const note_id: number = Number(
			req.nextUrl.searchParams.get("note_id") || ""
		);
		await prisma.note.delete({
			where: {
				note_id,
			},
		});
		return NextResponse.json({ message: "Note deleted" }, { status: 200 });
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
