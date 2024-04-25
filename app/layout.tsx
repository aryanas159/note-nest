import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Wrapper from "@/lib/Wrapper";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Notes App",
	description: "A simple notes app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>{<Wrapper>{children}</Wrapper>}</body>
		</html>
	);
}
