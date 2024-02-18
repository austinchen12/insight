import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function urlToSiteAbbreviation(url: string): string {
	const sites = {
		"nbc.com": "NBC",
		"cnn.com": "CNN",
		"nytimes.com": "New York Times",
		"bbc.com": "BBC",
		"theguardian.com": "The Guardian",
		"foxnews.com": "Fox News",
		"wsj.com": "WSJ",
		"washingtonpost.com": "The Washington Post",
		"abcnews.go.com": "ABC News",
		"reuters.com": "Reuters",
		"bloomberg.com": "Bloomberg",
		"usatoday.com": "USA Today",
		"cnbc.com": "CNBC",
		"time.com": "Time",
		"npr.org": "NPR",
		"huffpost.com": "HuffPost",
		"forbes.com": "Forbes",
		"latimes.com": "LA Times",
		"apnews.com": "Associated Press",
		"politico.com": "Politico",
		"news.yahoo.com": "Yahoo News",
		"businessinsider.com": "Business Insider",
		"axios.com": "Axios",
		"thedailybeast.com": "The Daily Beast",
		"vice.com": "Vice",
		"buzzfeednews.com": "BuzzFeed News",
		"independent.co.uk": "The Independent",
		"msnbc.com": "MSNBC",
		"thedailymail.co.uk": "Daily Mail",
		"theatlantic.com": "The Atlantic",
	};

	const urlObj = new URL(url);
	const hostname = urlObj.hostname;

	// Remove "www." if present
	const cleanHostname = hostname.replace("www.", "");

	return sites[cleanHostname] || cleanHostname;
}
