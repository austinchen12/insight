import { useState } from "react";
import { BsFillXCircleFill } from "react-icons/bs";
import { FaAngleDown, FaAngleUp, FaCheckCircle } from "react-icons/fa";

import { Button } from "~/components/ui/button";
import { PinkProgress, PurpleProgress } from "~/components/ui/progress";
import { urlToSiteAbbreviation } from "~lib/utils";
import type { GlobalData, SpecificPoint, SupersetPoint } from "~popup";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./ui/collapsible";

function Topics({ data }: { data: GlobalData }) {
	const numArticles = data.relevantArticles.length; // + 1?

	// Should memoize this
	const numTopics = data.supersetPoints.length;

	let moreBiased = 0;

	// TODO: num more and less biased than avg

	return (
		<div className="flex flex-col gap-2 px-3 py-2">
			<div className="flex justify-between items-center">
				<h2 className="scroll-m-20 text-2xl font-medium tracking-tight">
					Topics
				</h2>
				<p>
					{numTopics} {numTopics > 1 ? "topics" : "topic"} across {numArticles}{" "}
					articles
				</p>
			</div>

			{/* Topics overview */}
			<div className="flex gap-2">
				<TopicOverviewNote
					stat1={data.thisArticle.specificPoints.length}
					stat2={numTopics}
					title="Topics included vs. total"
				/>
				<TopicOverviewNote
					stat1={0}
					stat2={numTopics}
					title="More biased than the avg"
				/>

				<TopicOverviewNote
					stat1={0}
					stat2={numTopics}
					title="More negative than the avg"
				/>
			</div>

			{/* Topic cards */}
			{data.supersetPoints.map((supersetPoint, idx) => (
				<TopicCard data={data} supersetPoint={supersetPoint} key={idx} />
			))}
		</div>
	);
}

function TopicOverviewNote({ stat1, stat2, title }) {
	return (
		<Card className="flex flex-col items-center w-full gap-2">
			<p className="mt-4 text-2xl">
				{stat1}
				<span>
					{" / "}
					{stat2}
				</span>
			</p>
			<p className="text-center">{title}</p>
		</Card>
	);
}

function TopicCard({
	data,
	supersetPoint,
}: {
	data: GlobalData;
	supersetPoint: SupersetPoint;
}) {
	const [showBreakdown, setShowBreakdown] = useState(false);

	let included = false;
	let connectedPoint: SpecificPoint | null = null;
	for (const specificPoint of data.thisArticle.specificPoints) {
		if (specificPoint.superset_point_id == supersetPoint.id) {
			included = true;
			connectedPoint = specificPoint;
			break;
		}
	}

	const connectedRelatedPoints: SpecificPoint[] = [];
	for (const relevantArticle of data.relevantArticles) {
		const connectedPoints = relevantArticle.specificPoints.filter(
			(point) => point.superset_point_id == supersetPoint.id
		);
		connectedRelatedPoints.push(...connectedPoints);
	}

	let avgRelatedBias = 0;
	for (const connectedPoint of connectedRelatedPoints) {
		avgRelatedBias += connectedPoint.bias.biased;
	}
	avgRelatedBias = (avgRelatedBias * 100) / connectedRelatedPoints.length;

	let avgRelatedPositive = 0;
	for (const connectedPoint of connectedRelatedPoints) {
		avgRelatedPositive += connectedPoint.sentiment.POS;
	}
	avgRelatedPositive =
		(avgRelatedPositive * 100) / connectedRelatedPoints.length;

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="text-sm">
					{supersetPoint.title_generated}
				</CardTitle>
				<CardDescription>
					{included ? (
						<div className="flex gap-1 items-center text-primary/75">
							<FaCheckCircle className="text-primary/75" />
							<p>This article includes this topic</p>
						</div>
					) : (
						<div className="flex gap-1 items-center text-muted-foreground/60">
							<BsFillXCircleFill className="text-muted-foreground/60" />
							<p>This article does not include this topic</p>
						</div>
					)}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{connectedPoint && (
					<>
						<StatsRow
							title="This article"
							stat1Title="biased"
							stat1Val={connectedPoint.bias.biased * 100}
							stat2Title="positive"
							stat2Val={connectedPoint.sentiment.POS * 100}
						/>
						<StatsRow
							title="Related articles"
							stat1Title="biased"
							stat1Val={avgRelatedBias}
							stat2Title="positive"
							stat2Val={avgRelatedPositive}
						/>
					</>
				)}

				<Collapsible open={showBreakdown} onOpenChange={setShowBreakdown}>
					<CollapsibleTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="text-xs hover:underline -ml-3"
							onClick={() => setShowBreakdown(true)}>
							{showBreakdown ? "Hide Breakdown" : "View Breakdown"}
							{showBreakdown ? <FaAngleUp /> : <FaAngleDown />}
						</Button>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<div className="border-t border-dark mt-1 pt-1">
							{data.relevantArticles.map((relevantArticle, idx) => (
								<StatsRow
									key={idx}
									title={urlToSiteAbbreviation(relevantArticle.url)}
									stat1Title="biased"
									stat1Val={relevantArticle.bias * 100}
									stat2Title="positive"
									stat2Val={relevantArticle.sentiment.POS * 100}
								/>
							))}
						</div>
					</CollapsibleContent>
				</Collapsible>
			</CardContent>
		</Card>
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
