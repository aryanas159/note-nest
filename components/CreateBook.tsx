"use client";
import { useState } from "react";
import api from "@/lib/api";
import { CircularProgress } from "@mui/joy";
import { useRouter } from "next/navigation";
type Props = {
	user_email: string;
	setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
};
import AddIcon from "@mui/icons-material/Add";
function CreateBook({ user_email, setBooks }: Props) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const handleCreate = async () => {
		try {
			setIsLoading(true);
			const { data } = await api.post("/book", {
				book_title: "Title",
				user_email,
			});
			router.push(`?book_id=${data.book.book_id}`);
			setBooks((prev) => [...prev, data.book]);
			setIsLoading(false);
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	};
	return (
		<div className="p-4 flex flex-col items-center">
			{isLoading ? (
				<CircularProgress size="sm" variant="plain" />
			) : (
				<button
					className="flex items-center gap-2 p-2 rounded-lg bg-[#1f1f1f] hover:scale-105 transition-all"
					onClick={handleCreate}
				>
					<AddIcon />
					<p className="text-xs">Add a book</p>
				</button>
			)}
		</div>
	);
}
export default CreateBook;
