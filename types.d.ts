type User = {
	email: string;
	name: string;
	image?: string;
};
type Book = {
	book_id: number;
	book_title: string;
	user_email: string;
	book_description: string;
	created_at: string;
};
type Note = {
	note_id: number;
	note_title: string;
	book_id: number;
	note_body: string;
	created_at: string;
};
