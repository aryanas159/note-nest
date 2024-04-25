type Props = {
	book_id: Number;
	setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
};
import AddIcon from "@mui/icons-material/Add";
import api from "@/lib/api";
function AddPage({ book_id, setNotes }: Props) {
	const handleCreate = async () => {
		const newNote = await api.post("/note", {
			note_title: "Untitled",
			book_id,
		})
		setNotes((prev) => [...prev, newNote.data.note]);
	};
	return (
		<button
			className="flex items-center gap-2 p-2 rounded-lg bg-[#1f1f1f] hover:scale-105 transition-all"
			onClick={handleCreate}
		>
			<AddIcon />
			<p className="text-xs">Add a Note</p>
		</button>
	);
}
export default AddPage;
