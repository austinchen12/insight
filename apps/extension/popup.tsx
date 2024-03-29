import logo from "data-base64:~assets/icon.png";
import { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { MdOutlineLibraryBooks } from "react-icons/md";

import Summary from "~components/Summary";
import Topics from "~components/Topics";
import { Button } from "~components/ui/button";

import "~style.css";

import { Skeleton } from "~components/ui/skeleton";
import { app } from "~lib/eden";

import type { GlobalData } from "../backend/src";

const getCurrentTabUrl = async () => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	if (!tab) return "";
	return tab.url;
};

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="font-fredoka h-[600px] w-[400px] flex flex-col">
			<Header />
			{children}
		</div>
	);
}

const EMPTY_GLOBAL_DATA = {
	thisArticle: {
		id: "",
		title: "",
		url: "",
		bias: 0,
		sentiment: { NEG: 0, NEU: 0, POS: 0 },
		embedding: [],
		specificPoints: [],
	},
	relevantArticles: [],
	supersetPoints: [],
};

function IndexPopup() {
	const [page, setPage] = useState<"summary" | "topics">("summary");
	const [data, setData] = useState<GlobalData>(EMPTY_GLOBAL_DATA);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		(async () => {
			const url = await getCurrentTabUrl();
			const { data, error } = await app.getGlobalData.get({
				$query: { url },
			});
			if (error) {
				setError(error);
				throw error;
			}
			setData(data);
			setIsLoading(false);
		})();
	}, []);

	return (
		<Layout>
			{error ? (
				<div className="flex items-center justify-center">
					<p>Error: {error.message}</p>
				</div>
			) : isLoading ? (
				<SkeletonLoaders />
			) : (
				<div className="pb-16">
					{page == "summary" ? <Summary data={data} /> : <Topics data={data} />}
				</div>
			)}
			<Footer page={page} onPageChange={setPage} />
		</Layout>
	);
}

function SkeletonLoaders() {
	return (
		<div className="flex flex-col gap-2 px-3 py-2 ">
			<div className="flex justify-between items-center">
				<h2 className="scroll-m-20 text-2xl font-medium tracking-tight">
					Summary
				</h2>
				<Skeleton className="h-10 w-20" />
			</div>

			<div className="flex justify-between items-center gap-2">
				<Skeleton className="h-48 w-48" />
				<Skeleton className="h-48 w-48" />
			</div>

			<h2 className="scroll-m-20 text-2xl font-medium tracking-tight">
				Scanned Articles
			</h2>

			<div className="flex flex-col gap-2">
				<Skeleton className="h-24 w-full" />
			</div>
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
