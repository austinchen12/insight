import { useState } from "react";

import "style.css";

function IndexPopup() {
	const [data, setData] = useState("");

	return (
		<div className="bg-blue-500 h-80 px-80">
			<h2 className="bg-blue-500">
				Welcome to your{" "}
				<a href="https://www.plasmo.com" target="_blank">
					Plasmo
				</a>{" "}
				Extension!sss
			</h2>
			<input onChange={(e) => setData(e.target.value)} value={data} />
			<a href="https://docs.plasmo.com" target="_blank">
				View Docs
			</a>
		</div>
	);
}

export default IndexPopup;
