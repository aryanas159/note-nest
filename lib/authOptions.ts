import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import api from "./api";
export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
		}),
	],
	callbacks: {
		async signIn({ user, account, profile }) {
			if (account?.provider == "google") {
				try {
					await api.post("/user/login", {
						email: user.email,
						name: user.name,
						image: user.image,
					});
				} catch (error) {
					console.log({ error });
					return false;
				}
				return true;
			}
			return false;
		},
	},
};
