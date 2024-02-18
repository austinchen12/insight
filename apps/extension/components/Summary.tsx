import { useState } from "react";
import { GoShare } from "react-icons/go";
import { RadialBar, RadialBarChart } from "recharts";

import { Button } from "~/components/ui/button";

import { Card } from "./ui/card";

function Summary() {
	// Sample data
	const biasData = [
		{
			name: "B",
			x: 100,
		},
		{
			name: "This article",
			x: 30,
			fill: "#A059FF",
		},
		{
			name: "Related Articles",
			x: 63,
			fill: "#11DFFF",
		},
	];

	const sentimentData = [
		{
			name: "B",
			x: 100,
		},
		{
			name: "This article",
			x: 54,
			fill: "#FEA419",
		},
		{
			name: "Related Articles",
			x: 72,
			fill: "#FF3B69",
		},
	];

	const sampleArticles: {
		title: string;
		site: string;
		bias: string;
		positive: string;
		url: string;
	}[] = [
		{
			title:
				"Billions of dollars are flowing into grants. Do we think that they can solve our problems?",
			site: "CNN",
			bias: "64",
			positive: "53",
			url: "https://cnn.com",
		},
		{
			title:
				"Billions of dollars are flowing into grants. Do we think that they can solve our problems?",
			site: "CNN",
			bias: "64",
			positive: "53",
			url: "https://cnn.com",
		},
		{
			title:
				"Billions of dollars are flowing into grants. Do we think that they can solve our problems?",
			site: "CNN",
			bias: "64",
			positive: "53",
			url: "https://cnn.com",
		},
		{
			title:
				"Billions of dollars are flowing into grants. Do we think that they can solve our problems?",
			site: "CNN",
			bias: "64",
			positive: "53",
			url: "https://cnn.com",
		},
		{
			title:
				"Billions of dollars are flowing into grants. Do we think that they can solve our problems?",
			site: "CNN",
			bias: "64",
			positive: "53",
			url: "https://cnn.com",
		},
		{
			title:
				"Billions of dollars are flowing into grants. Do we think that they can solve our problems?",
			site: "CNN",
			bias: "64",
			positive: "53",
			url: "https://cnn.com",
		},
		{
			title:
				"Billions of dollars are flowing into grants. Do we think that they can solve our problems?",
			site: "CNN",
			bias: "64",
			positive: "53",
			url: "https://cnn.com",
		},
		{
			title:
				"Billions of dollars are flowing into grants. Do we think that they can solve our problems?",
			site: "CNN",
			bias: "64",
			positive: "53",
			url: "https://cnn.com",
		},
		{
			title:
				"Billions of dollars are flowing into grants. Do we think that they can solve our problems?",
			site: "CNN",
			bias: "64",
			positive: "53",
			url: "https://cnn.com",
		},
	];

	return (
		<div className="flex flex-col gap-2 px-3 py-2 ">
			<div className="flex justify-between items-center">
				<h2 className="text-lg text-dark" style={{ fontWeight: 400 }}>
					Summary
				</h2>

				<Button className="py-2">
					Share <GoShare className="ml-2 h-4 w-4" />
				</Button>
			</div>

			<div className="flex justify-between items-center gap-2">
				{/* Bias */}
				<Card className="w-full flex flex-col items-center">
					<RadialBarChart
						width={100}
						height={100}
						data={biasData}
						// innerRadius="40%"
						margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
						// outerRadius="100%"
					>
						<RadialBar dataKey="x" background />
					</RadialBarChart>

					<p className="text-lg text-dark -mt-4" style={{ fontWeight: 500 }}>
						Bias
					</p>
					<div className="flex gap-2 items-center">
						<div className="h-2 w-2 bg-purple" />
						<div>This article</div>
					</div>
					<div className="flex gap-2 items-center">
						<div className="h-2 w-2 bg-blue" />
						<div>Related articles</div>
					</div>
				</Card>

				{/* Sentiment */}
				<Card className="w-full flex flex-col items-center">
					<RadialBarChart
						width={100}
						height={100}
						data={sentimentData}
						margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
						<RadialBar dataKey="x" background />
					</RadialBarChart>

					<p className="text-lg text-dark -mt-4" style={{ fontWeight: 500 }}>
						Sentiment
					</p>
					<div className="flex gap-2 items-center">
						<div className="h-2 w-2 bg-orange" />
						<div>This article</div>
					</div>
					<div className="flex gap-2 items-center">
						<div className="h-2 w-2 bg-pink" />
						<div>Related articles</div>
					</div>
				</Card>
			</div>

			<h2 className="text-lg text-dark mt-2" style={{ fontWeight: 400 }}>
				Scanned Articles
			</h2>

			{sampleArticles.map((article, idx) => (
				<ScannedArticle article={article} key={idx} />
			))}
		</div>
	);
}

// TODO: format sentiment
function ScannedArticle({ article }) {
	const openArticle = () => {
		window.open(article.url, "_blank"); // Open article URL in a new tab
	};

	return (
		<Card
			className="hover:cursor-pointer w-full hover:opacity-80"
			onClick={openArticle}>
			<h3 className="text-[#606060] text-sm">{article.title}</h3>
			<div className="flex gap-3 text-[#8DB613] text-xs">
				<p>
					{article.site} &#183; {article.bias}% bias &#183; {article.positive}%
					positive
				</p>
			</div>
		</Card>
	);
}

export default Summary;
