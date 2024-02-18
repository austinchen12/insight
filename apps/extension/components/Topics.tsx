import { useState } from "react";
import { BsFillXCircleFill } from "react-icons/bs";
import { FaAngleDown, FaCheckCircle } from "react-icons/fa";
import { GoShare } from "react-icons/go";
import { RadialBar, RadialBarChart } from "recharts";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { PinkProgress, PurpleProgress } from "~/components/ui/progress";

function Topics() {
	const sampleTopics = [
		{
			title: "Billions of dollars have been flowing into climate change",
			included: true,
			bias: { this: 45, others: 64 },
			sentiment: { this: 30, others: 65 },
		},
	];

	return (
		<div className="px-3 py-2">
			<div className="flex justify-between items-center">
				<h2 className="text-lg text-dark mb-2" style={{ fontWeight: 400 }}>
					Topics
				</h2>

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

			{sampleTopics.map((topic, idx) => (
				<TopicCard topic={topic} key={idx} />
			))}
		</div>
	);
}

function TopicCard({ topic }) {
	return (
		<div
			className={`w-full px-2 py-1 rounded-lg border border-[#A0CA21] mb-1 ${topic.included ? "bg-content-box" : "bg-[#F0FFC5]"}`}>
			<h3 className="text-[#606060] text-sm mb-1">{topic.title}</h3>

			{topic.included ? (
				<div className="flex gap-1 items-center text-[#8DB613]">
					<FaCheckCircle color="#A0CA21" />
					<p>This article includes this topic</p>
				</div>
			) : (
				<div className="flex gap-1 items-center text-[#B3B5AC]">
					<BsFillXCircleFill color="#B3B5AC" />
					<p>This article does not include this topic</p>
				</div>
			)}

			<StatsRow
				title="This article"
				stat1Title="biased"
				stat1Val={topic.bias.this}
				stat2Title="positive"
				stat2Val={topic.sentiment.this}
			/>
			<StatsRow
				title="Related articles"
				stat1Title="biased"
				stat1Val={topic.bias.others}
				stat2Title="positive"
				stat2Val={topic.sentiment.others}
			/>

			<button className="text-xs flex items-center hover:underline gap-1 mt-1 text-dark">
				View Breakdown <FaAngleDown />
			</button>
		</div>
	);
}

function StatsRow({ title, stat1Title, stat1Val, stat2Title, stat2Val }) {
	return (
		<div className="flex justify-between items-end mb-2">
			<p>{title}</p>
			<div className="flex items-center justify-end gap-2">
				{/* Stat 1 */}
				<div className="flex flex-col items-start text-pink w-[6rem]">
					<p className=" text-xs">
						{stat1Val.toString()}% {stat1Title}
					</p>
					<PinkProgress value={stat1Val} className="h-2" />
				</div>

				{/* Stat 2 */}
				<div className="flex flex-col items-start text-purple w-[6rem]">
					<p className=" text-xs w">
						{stat2Val.toString()}% {stat2Title}
					</p>
					<PurpleProgress value={stat2Val} className="h-2" />
				</div>
			</div>
		</div>
	);
}

export default Topics;
