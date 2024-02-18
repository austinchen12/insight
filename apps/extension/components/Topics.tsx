import { useState } from "react";
import { BsFillXCircleFill } from "react-icons/bs";
import { FaAngleDown, FaAngleUp, FaCheckCircle } from "react-icons/fa";
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
	const numArticles = 12;

	const sampleTopics = [
		{
			title: "Billions of dollars have been flowing into climate change",
			included: true,
			bias: { this: 45, others: 64 },
			sentiment: { this: 30, others: 65 },
			sites: [
				{
					name: "WSJ",
					bias: 20,
					sentiment: 84,
				},
				{
					name: "CNN",
					bias: 80,
					sentiment: 82,
				},
				{
					name: "New York Times",
					bias: 20,
					sentiment: 32,
				},
			],
		},
	];

	return (
		<div className="px-3 py-2">
			<div className="flex justify-between items-center">
				<h2 className="text-lg text-dark mb-2" style={{ fontWeight: 400 }}>
					Topics
				</h2>
				<p>
					{sampleTopics.length} {sampleTopics.length > 1 ? "topics" : "topic"}{" "}
					across {numArticles} articles
				</p>
			</div>

			{/* Topics overview */}
			<div className="flex gap-3">
				<TopicOverviewNote
					stat1={1}
					stat2={sampleTopics.length}
					title="Topics included vs. total"
				/>
				<TopicOverviewNote
					stat1={0}
					stat2={sampleTopics.length}
					title="More biased than the avg"
				/>

				<TopicOverviewNote
					stat1={0}
					stat2={sampleTopics.length}
					title="More negative than the avg"
				/>
			</div>

			{/* Topic cards */}
			{sampleTopics.map((topic, idx) => (
				<TopicCard topic={topic} key={idx} />
			))}
		</div>
	);
}

function TopicOverviewNote({ stat1, stat2, title }) {
	return (
		<div className="bg-content-box rounded-lg flex flex-col items-center w-full px-2 pb-2 mb-4">
			<p className="mt-4 text-2xl mb-1 text-black">
				{stat1}
				<span className="text-[#555]">
					{" / "}
					{stat2}
				</span>
			</p>
			<p className="text-center">{title}</p>
		</div>
	);
}

function TopicCard({ topic }) {
	const [showBreakdown, setShowBreakdown] = useState(false);

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
			<div className="h-2"></div>

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

			{!showBreakdown ? (
				<button
					className="text-xs flex items-center hover:underline gap-1 mt-1 text-dark"
					onClick={() => setShowBreakdown(true)}>
					View Breakdown <FaAngleDown />
				</button>
			) : (
				<button
					className="text-xs flex items-center hover:underline gap-1 mt-1 text-dark"
					onClick={() => setShowBreakdown(false)}>
					Hide Breakdown <FaAngleUp />
				</button>
			)}

			{showBreakdown && (
				<div className="border-t border-dark mt-1 pt-1">
					{topic.sites.map((site, idx) => (
						<StatsRow
							key={idx}
							title={site.name}
							stat1Title="biased"
							stat1Val={site.bias}
							stat2Title="positive"
							stat2Val={site.sentiment}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function StatsRow({ title, stat1Title, stat1Val, stat2Title, stat2Val }) {
	return (
		<div className="flex justify-between items-end mb-2">
			<p>{title}</p>
			<div className="flex items-center justify-end gap-4">
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
