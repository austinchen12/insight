import logo from "data-base64:~assets/icon.png";
import { useState } from "react";
import { FaList } from "react-icons/fa";
import { MdOutlineLibraryBooks } from "react-icons/md";

import Summary from "~components/Summary";
import Topics from "~components/Topics";
import { Button } from "~components/ui/button";

import "~style.css";

function IndexPopup() {
	const [page, setPage] = useState<"summary" | "topics">("summary");
	return (
		<div className="font-fredoka pb-32 h-[600px] w-[400px] flex flex-col justify-between">
			<Header />
			{page == "summary" ? <Summary /> : <Topics />}
			<Footer page={page} onPageChange={setPage} />
		</div>
	);
}
function Header() {
	return (
		<div
			className="flex justify-between items-center px-4 border-b border-white py-2"
			style={{ fontWeight: 600 }}>
			<h1 className="text-2xl text-primary">Insight Critter</h1>
			<img src={logo} alt="Icon" draggable={false} className="h-12 w-12" />
		</div>
	);
}

function Footer({
	page,
	onPageChange,
}: {
	page: "summary" | "topics";
	onPageChange: (page: "summary" | "topics") => void;
}) {
	return (
		<div className="w-full bg-background flex justify-between items-center border-t fixed bottom-0">
			<Button
				className="w-full rounded-none"
				onClick={() => onPageChange("summary")}
				variant={page === "summary" ? "default" : "ghost"}>
				<MdOutlineLibraryBooks className="h-4 w-4" />
			</Button>
			<Button
				className="w-full rounded-none"
				onClick={() => onPageChange("topics")}
				variant={page === "topics" ? "default" : "ghost"}>
				<FaList className="h-4 w-4" />
			</Button>
		</div>
	);
}

export default IndexPopup;
