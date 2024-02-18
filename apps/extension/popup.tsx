import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import logo from "data-base64:~assets/icon.png";
import { useState } from "react";
import { FaList } from "react-icons/fa";
import { MdOutlineLibraryBooks } from "react-icons/md";

import Summary from "~components/Summary";
import Topics from "~components/Topics";
import { Button } from "~components/ui/button";

import "~style.css";

import { app } from "~lib/eden";

const getCurrentTabUrl = async () => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	if (!tab) return "";
	return tab.url;
};

const queryClient = new QueryClient();

function IndexPopup() {
	const [page, setPage] = useState<"summary" | "topics">("summary");
	// const { data, isLoading, isError } = useQuery({
	// 	queryKey: ["getArticle"],
	// 	queryFn: async () => {
	// 		const url = await getCurrentTabUrl();
	// 		const { data, error } = await app.getGlobalData.get({
	// 			$query: { url },
	// 		});
	// 		if (error) throw error;
	// 		return data;
	// 	},
	// });

	return (
		<QueryClientProvider client={queryClient}>
			<div className="font-fredoka h-[600px] w-[400px] flex flex-col">
				<Header />
				{/* {isLoading ? (
					<div className="flex items-center justify-center">Loading...</div>
				) : (
					<div className="pb-16">
						{page == "summary" ? (
							<Summary data={data} />
						) : (
							<Topics data={data} />
						)}
					</div>
				)} */}
				<Footer page={page} onPageChange={setPage} />
			</div>
		</QueryClientProvider>
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
