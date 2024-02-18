import axios from "axios";
import logo from "data-base64:~assets/icon.png";
import { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { MdOutlineLibraryBooks } from "react-icons/md";

import Summary from "~components/Summary";
import Topics from "~components/Topics";
import { Button } from "~components/ui/button";

import "~style.css";

export type Sentiment = { NEG: number; NEU: number; POS: number };
export type Bias = { biased: number; "non-biased": number };

export type Article = {
	id: string;
	title: string;
	url: string;
	bias: number;
	sentiment: Sentiment;
	embedding: number[];
	specificPoints: SpecificPoint[];
};

export type SpecificPoint = {
	id: string;
	article_id: string;
	original_excerpt: string;
	embedding: number[];
	bias: Bias;
	sentiment: Sentiment;
	superset_point_id: string;
};

export type SupersetPoint = {
	id: string;
	title_generated: string;
};

export type GlobalData = {
	thisArticle: Article;
	relevantArticles: Article[];
	supersetPoints: SupersetPoint[];
};

function IndexPopup() {
	const [page, setPage] = useState<"summary" | "topics">("summary");
	const [data, setData] = useState<GlobalData | undefined>(undefined);
	const [url, setUrl] = useState("");

	useEffect(() => {
		// Get current location
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs.length > 0) {
				const currentTab = tabs[0];
				setUrl(currentTab.url);
			} else {
				setUrl("");
			}
		});

		async function loadData() {
			setData(undefined);

			// TODO: grab data

			try {
				const returnedData: GlobalData = await axios.get(
					`...?url=${encodeURIComponent(url)}`
				);

				setData(returnedData);
			} catch (e) {
				console.error(e);
				setData(undefined);
			}
		}

		if (url) loadData();
	}, [url]);

	return (
		<div className="font-fredoka h-[600px] w-[400px] flex flex-col">
			<Header />
			{!!data && (
				<div className="pb-16">
					{page == "summary" ? <Summary data={data} /> : <Topics data={data} />}
				</div>
			)}

			{!data && (
				<div className="flex items-center justify-center">Loading...</div>
			)}
			<Footer page={page} onPageChange={setPage} />
		</div>
	);
}
function Header() {
	return (
		<div className="flex justify-between items-center px-4 border-b border-white py-2 font-bold">
			<h1 className="text-2xl text-primary">Kaleido</h1>
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
