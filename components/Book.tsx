import React from "react";
type Props = {
	book: Book;
	setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
	notes: Note[];
};
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
function Book({ book, setBooks, notes }: Props) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const selectedBook = Number(searchParams.get("book_id")) || null;
	const selectedNote = Number(searchParams.get("note_id")) || null;
	return (
		<div className="flex flex-col gap-2">
			<div
				className={`p-4 rounded-lg cursor-pointer hover:scale-105 transition-all border border-primary w-full flex justify-between items-center ${
					selectedBook == book.book_id && "bg-primary text-black"
				}`}
				onClick={() => {
					router.push(`?book_id=${book.book_id}`);
				}}
			>
				<h3
					className={`text-lg font-semibold ${
						selectedBook == book.book_id && "text-black"
					}`}
				>
					{book.book_title}
				</h3>
				<p
					className={`text-xs ${selectedBook == book.book_id && "text-black"}`}
				>
					{new Date(book.created_at).toLocaleDateString()}
				</p>
				<MdDelete
					className="text-lg"
					onClick={async () => {
						try {
							await api.delete(
								`/book?book_id=${book.book_id}&user_email=${book.user_email}`
							);
							setBooks((prev) => {
								return prev.filter((b) => b.book_id !== book.book_id);
							});
							router.push("/?book_id=null");
						} catch (error) {
							console.error(error);
						}
					}}
				/>
			</div>
			<div>
				{selectedBook == book.book_id && selectedNote && (
					<div className="p-2 flex gap-1 flex-col max-h-[20vh] overflow-auto">
						{notes.length > 0 &&
							notes.map((note) => (
								<button
									key={note.note_id}
									className={`p-2 text-xs hover:bg-[#292929] transition-all rounded-lg flex items-end gap-2 ${
										selectedNote == note.note_id && "bg-[#292929] text-white"
									}`}
									onClick={() =>
										router.push(
											`?book_id=${selectedBook}&&note_id=${note.note_id}`
										)
									}
								>
									<h3 className="text-sm">{note.note_title}</h3>
								</button>
							))}
					</div>
				)}
			</div>
		</div>
	);
}

export default Book;
