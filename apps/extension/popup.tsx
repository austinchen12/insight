import logo from "data-base64:~assets/icon.png";
import { useState } from "react";
import { FaList } from "react-icons/fa";
import { MdOutlineLibraryBooks } from "react-icons/md";

import Summary from "~components/Summary";
import Topics from "~components/Topics";
import { Button } from "~components/ui/button";
import { cn } from "~lib/utils";

import "~style.css";

function IndexPopup() {
	const [page, setPage] = useState<"summary" | "topics">("summary");

	return (
		<div className="font-fredoka h-[600px] w-[400px] flex flex-col justify-between">
			<div>
				{/* Header */}
				<div
					className="flex justify-between items-center px-4 border-b border-white py-2"
					style={{ fontWeight: 600 }}>
					<h1 className="text-2xl text-dark-green">Insight Critter</h1>
					<img src={logo} alt="Icon" draggable={false} className="h-12 w-12" />
				</div>

				{page == "summary" ? <Summary /> : <Topics />}
			</div>

			<Footer page={page} onPageChange={setPage} />
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
		<div className="h-8 w-full bg-background flex justify-between items-center px-4 border-t fixed bottom-0">
			<Button onClick={() => onPageChange("summary")} className={cn("w-full")}>
				<MdOutlineLibraryBooks className="h-4 w-4" />
			</Button>
			<Button onClick={() => onPageChange("topics")} className={cn("w-full")}>
				<FaList className="h-4 w-4" />
			</Button>
		</div>
	);
}

export default IndexPopup;
