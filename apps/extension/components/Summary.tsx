import { useState } from "react";
import { GoShare } from "react-icons/go";
import { RadialBar, RadialBarChart } from "recharts";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";

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

	return (
		<div className="px-4 py-2">
			<div className="flex justify-between items-center">
				<h2 className="text-lg text-dark" style={{ fontWeight: 400 }}>
					Summary
				</h2>

				<Button className="py-2 text-sm bg-dark-green">
					Share <GoShare className="ml-2 h-4 w-4" />
				</Button>
			</div>

			<div className="flex justify-between items-center mt-2">
				{/* Bias */}
				<div className="bg-content-box h-36 w-36 rounded-lg border border-dark-green flex flex-col items-center">
					<div className="flex items-center justify-center -mt-2">
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
					</div>

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
				</div>

				{/* Sentiment */}
				<div className="bg-content-box h-36 w-36 rounded-lg border border-dark-green flex flex-col items-center">
					<div className="flex items-center justify-center -mt-2">
						<RadialBarChart
							width={100}
							height={100}
							data={sentimentData}
							margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
							<RadialBar dataKey="x" background />
						</RadialBarChart>
					</div>

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
				</div>
			</div>

			{/* <Accordion type="single" collapsible className="w-full">
				<AccordionItem value="item-1">
					<AccordionTrigger>Is it accessible?</AccordionTrigger>
					<AccordionContent>
						Yes. It adheres to the WAI-ARIA design pattern.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>Is it styled?</AccordionTrigger>
					<AccordionContent>
						Yes. It comes with default styles that matches the other
						components&apos; aesthetic.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-3">
					<AccordionTrigger>Is it animated?</AccordionTrigger>
					<AccordionContent>
						Yes. It&apos;s animated by default, but you can disable it if you
						prefer.
					</AccordionContent>
				</AccordionItem>
			</Accordion> */}
		</div>
	);
}

export default Summary;
