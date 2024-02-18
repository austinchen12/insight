import logo from "data-base64:~assets/icon.png";
import { useState } from "react";
import { FaList } from "react-icons/fa";
import { MdOutlineLibraryBooks } from "react-icons/md";

import "~style.css";

import Summary from "~components/Summary";
import Topics from "~components/Topics";

function IndexPopup() {
	const [page, setPage] = useState<"summary" | "topics">("summary");

	return (
		<div className="font-fredoka h-[600px] w-[400px] flex flex-col justify-between bg-bg ">
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

			{/* Footer */}
			<div
				className="h-[3rem] flex justify-center gap-4 items-center px-4 border-t border-white "
				style={{ fontWeight: 600 }}>
				<button
					onClick={() => setPage("summary")}
					className={page == "summary" && "border-b-2 border-dark-green "}>
					<MdOutlineLibraryBooks className={`h-8 w-8 `} />
				</button>
				<button
					onClick={() => setPage("topics")}
					className={page == "topics" && "border-b-2 border-dark-green "}>
					<FaList className={`h-6 w-6 `} />
				</button>
			</div>
		</div>
	);
}

export default IndexPopup;
