import logo from "data-base64:~assets/icon.png";
import { useState } from "react";

import "~style.css";

import Summary from "~components/Summary";
import Topics from "~components/Topics";

function IndexPopup() {
	const [page, setPage] = useState<"summary" | "topics">("summary");

	return (
		<div className="h-[600px] w-[350px] flex flex-col justify-between bg-bg ">
			<div>
				{/* Header */}
				<div className="h-[2rem] flex justify-between items-center px-4 border-b border-white">
					<h1>Insight Critter</h1>
					<img src={logo} alt="Icon" draggable={false} className="h-8 w-8" />
				</div>

				{page == "summary" ? <Summary /> : <Topics />}
			</div>

			{/* Footer */}
			<div className="h-[2rem] "></div>
		</div>
	);
}

export default IndexPopup;
