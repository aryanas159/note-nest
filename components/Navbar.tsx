"use client";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { signIn, useSession, signOut } from "next-auth/react";

type Props = {};

function Navbar({}: Props) {
	const { data: session } = useSession();
	return (
		<AppBar
			position="static"
			className="bg-primary backdrop-blur-sm z-10"
			// sx={{ backgroundColor: "#fff" }}
		>
			<Toolbar className="flex">
				<Box className="flex grow items-center gap-2">
					<a
						href="/"
						className="text-black mr-2 font-AROneSans font-bold text-[1.2rem] sm:text-[1.4rem]"
					>
						Notes
					</a>
				</Box>
				<Box className="flex items-center justify-center gap-6">
					{session?.user ? (
						<div className="flex gap-2">
							<Avatar
								src={session.user.image}
								alt={session.user.name}
								sizes="small"
								onClick={() => signOut()}
								className="cursor-pointer"
							/>
							<div className="flex flex-col text-black">
								<h3 className="font-semibold">{session.user.name}</h3>
								<p className="text-sm font-semibold">{session.user.email}</p>
							</div>
						</div>
					) : (
						<Button
							variant="text"
							className="font-semibold font-Poppins text-red text-[0.8rem] rounded-2xl transition-all"
							onClick={() => signIn("google")}
						>
							Sign in
						</Button>
					)}
				</Box>
			</Toolbar>
		</AppBar>
	);
}

export default Navbar;
