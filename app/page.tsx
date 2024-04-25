"use client";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Book from "@/components/Book";
import CreateBook from "@/components/CreateBook";
import { CircularProgress } from "@mui/joy";
import AddPage from "@/components/AddPage";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { TbPointFilled } from "react-icons/tb";
import { MdDelete } from "react-icons/md";

export default function Home() {
	const [books, setBooks] = useState<Book[]>([]);
	const { data: session } = useSession();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const searchParams = useSearchParams();
	const router = useRouter();
	const selectedBook = Number(searchParams.get("book_id")) || null;
	const [notes, setNotes] = useState<Note[]>([]);
	const selectedNote = Number(searchParams.get("note_id")) || null;
	useEffect(() => {
		if (session?.user) {
			api
				.get(`/book?user_email=${session.user.email}`)
				.then((response) => {
					setBooks(response.data.books);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [session]);
	useEffect(() => {
		if (selectedBook) {
			api
				.get(`/note?book_id=${selectedBook}`)
				.then((response) => {
					setNotes(response.data.notes);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [selectedBook]);
	return (
		<main className="bg-black w-screen h-screen flex flex-col">
			<Navbar />
			<div className="flex flex-1">
				<div className="flex flex-col w-[20vw] bg-[#141414] h-full p-4 items-center">
					{session?.user?.email ? (
						<>
							<h2 className="text-lg font-semibold">Your Books</h2>
							<CreateBook user_email={session.user.email} setBooks={setBooks} />
							<div className="w-full flex flex-col gap-2 p-4 ">
								{books.map((book) => (
									<Book
										key={book.book_id}
										book={book}
										setBooks={setBooks}
										notes={notes}
									/>
								))}
							</div>
						</>
					) : (
						<p>You need to sign in to see your books</p>
					)}
				</div>
				<div className="flex-1 flex flex-col h-full">
					{selectedBook && books.length > 0 ? (
						<>
							{!selectedNote && (
								<div className="flex items-end gap-16 p-4 px-16">
									<input
										className="text-[2rem] font-semibold bg-black p-2 outline-none border-b border-primary"
										value={
											books.filter((book) => book.book_id == selectedBook)[0]
												?.book_title
										}
										onChange={async (e) => {
											setBooks((prev) => {
												return prev.map((book) => {
													if (book.book_id === selectedBook) {
														book.book_title =
															e.target.value == ""
																? "Untitled"
																: e.target.value;
													}
													return book;
												});
											});
											try {
												setIsLoading(true);
												const currentBook = books.filter(
													(book) => book.book_id == selectedBook
												)[0];
												await api.put("/book", {
													book_id: currentBook.book_id,
													book_title: currentBook.book_title,
													book_description: e.target.value,
													user_email: session?.user?.email,
												});
												setIsLoading(false);
											} catch (error) {
												console.error(error);
												setIsLoading(false);
											}
										}}
									/>
									{/* {isLoading && (
									<CircularProgress
										variant="plain"
										size="sm"
										className="text-white text-xs"
									/>
								)} */}
									<AddPage book_id={selectedBook} setNotes={setNotes} />
								</div>
							)}
							{notes.length > 0 ? (
								<>
									{selectedNote ? (
										<div className="px-16 p-4 flex-1 flex flex-col gap-2 items-start">
											<div className="p-4 flex gap-2 items-center">
												<TbPointFilled />
												<input
													className="text-[2rem] font-semibold bg-black outline-none"
													value={
														notes.filter(
															(note) => note.note_id == selectedNote
														)[0]?.note_title
													}
													onChange={async (e) => {
														setNotes((prev) => {
															return prev.map((note) => {
																if (note.note_id === selectedNote) {
																	note.note_title =
																		e.target.value == ""
																			? "Untitled"
																			: e.target.value;
																}
																return note;
															});
														});
														try {
															setIsLoading(true);
															const currentNote = notes.filter(
																(note) => note.note_id == selectedNote
															)[0];
															await api.put("/note", {
																note_id: currentNote.note_id,
																note_title: e.target.value,
																note_body: currentNote.note_body,
															});
															setIsLoading(false);
														} catch (error) {
															console.error(error);
															setIsLoading(false);
														}
													}}
												/>
											</div>
											<div className="p-8 w-full flex-1">
												<textarea
													className="bg-black w-full min-h-full text-white outline-0 p-4"
													placeholder="Write your notes here"
													maxLength={2000}
													value={
														notes.filter(
															(note) => note.note_id == selectedNote
														)[0].note_body
													}
													onChange={async (e) => {
														setNotes((prev) => {
															return prev.map((note) => {
																if (note.note_id === selectedNote) {
																	note.note_body = e.target.value;
																}
																return note;
															});
														});
														try {
															setIsLoading(true);
															const currentNote = notes.filter(
																(note) => note.note_id == selectedNote
															)[0];
															await api.put("/note", {
																note_id: currentNote.note_id,
																note_title: currentNote.note_title,
																note_body: e.target.value,
															});
															setIsLoading(false);
														} catch (error) {
															console.error(error);
															setIsLoading(false);
														}
													}}
												></textarea>
												<h3>
													{
														notes.filter(
															(note) => note.note_id == selectedNote
														)[0].note_body.length
													}{" "}
													/ 2000
												</h3>
											</div>
										</div>
									) : (
										<div className="p-4 pr-28 pl-16  flex flex-col gap-4">
											{notes.map((note) => (
												<button
													key={note.note_id}
													className="p-2 text-sm hover:bg-[#181818] transition-all rounded-lg flex items-center gap-2 border border-primary"
													onClick={() =>
														router.push(
															`?book_id=${selectedBook}&&note_id=${note.note_id}`
														)
													}
												>
													<TbPointFilled />
													<div className="flex items-center justify-between flex-1">
														<div className="flex items-end gap-4 ">
															<h3 className="text-lg font-semibold ">
																{note.note_title}
															</h3>
															<p className="text-xs">
																{new Date(note.created_at).toLocaleDateString()}
															</p>
														</div>
														<button>
															<MdDelete
																className="text-lg"
																onClick={async (e) => {
																	e.stopPropagation();
																	try {
																		await api.delete(
																			`/note?note_id=${note.note_id}`
																		);
																		setNotes((prev) => {
																			return prev.filter(
																				(n) => n.note_id !== note.note_id
																			);
																		});
																	} catch (error) {
																		console.error(error);
																	}
																}}
															/>
														</button>
													</div>
												</button>
											))}
										</div>
									)}
								</>
							) : (
								<div className="p-8 w-full flex-1">
									<textarea
										className="bg-black w-full min-h-full text-white p-4 outline-0"
										placeholder="
								Write your notes here
								"
										value={
											books.filter((book) => book.book_id == selectedBook)[0]
												.book_description
										}
										onChange={async (e) => {
											setBooks((prev) => {
												return prev.map((book) => {
													if (book.book_id === selectedBook) {
														book.book_description = e.target.value;
													}
													return book;
												});
											});
											try {
												setIsLoading(true);
												const currentBook = books.filter(
													(book) => book.book_id == selectedBook
												)[0];
												await api.put("/book", {
													book_id: currentBook.book_id,
													book_title: currentBook.book_title,
													book_description: e.target.value,
													user_email: session?.user?.email,
												});
												setIsLoading(false);
											} catch (error) {
												console.error(error);
												setIsLoading(false);
											}
										}}
									></textarea>
								</div>
							)}
						</>
					) : (
						<h1 className="text-2xl font-semibold p-4 text-center">
							Select a book from the left to see the notes in it or create a new
							book
						</h1>
					)}
				</div>
			</div>
		</main>
	);
}
