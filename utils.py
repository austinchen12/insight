from sentence_transformers import SentenceTransformer

def fetch_article(filename):
    try:
        with open(filename, 'r') as f:
            article = f.read()
            return article
    except FileNotFoundError:
        print('Article not found.')


model = SentenceTransformer('all-MiniLM-L6-v2')
def embed_text(text):
    return model.encode(text, normalize_embeddings=True).tolist()

resolver = {
    # Jimmy Kimmel
    "https://www.nbcnews.com/news/us-news/former-rep-george-santos-sues-jimmy-kimmel-accuses-misusing-cameo-vide-rcna139331": "articles/George Santos Lawsuit/Former Rep. George Santos sues Jimmy Kimmel, accuses him of misusing Cameo videos.md",
    "https://www.newsweek.com/george-santos-files-federal-lawsuit-against-jimmy-kimmel-1870925": "articles/George Santos Lawsuit/George Santos Files Federal Lawsuit Against Jimmy Kimmel.md",
    "https://www.vulture.com/article/george-santos-is-suing-his-cameo-customer-jimmy-kimmel.html": "articles/George Santos Lawsuit/George Santos Is Suing His Cameo Customer Jimmy Kimmel.md",
    "https://www.avclub.com/george-santos-suing-jimmy-kimmel-cameo-1851266941": "articles/George Santos Lawsuit/George Santos is suing Jimmy Kimmel for buying Cameos from him under false pretenses.md",
    "https://www.forbes.com/sites/jamesfarrell/2024/02/17/george-santos-sues-jimmy-kimmel-for-buying-cameo-prank-videos/": "articles/George Santos Lawsuit/George Santos Sues Jimmy Kimmel For Buying Cameo Prank Videos.md",
    "https://www.thedailybeast.com/george-santos-sues-jimmy-kimmel-for-pranking-him-on-cameo": "articles/George Santos Lawsuit/George Santos Sues Jimmy Kimmel for Pranking Him on Cameo.md",
    "https://www.foxnews.com/media/former-rep-george-santos-sues-jimmy-kimmel-soliciting-broadcasting-cameo-videos-committed-fraud": "articles/George Santos Lawsuit/George Santos sues Jimmy Kimmel for soliciting, broadcasting Cameo videos  Fox News.md",
    "https://www.tmz.com/2024/02/17/george-santos-sues-jimmy-kimmel-using-cameo-videos-on-show/": "articles/George Santos Lawsuit/George Santos Sues Jimmy Kimmel For Using Cameo Videos On Show.md",
    "https://apnews.com/article/george-santos-jimmy-kimmel-copyright-lawsuit-41e1c2951945e11c069a41f9ea62281d": "articles/George Santos Lawsuit/George Santos sues Jimmy Kimmel over Cameo video pranks  AP News.md",
    "https://www.nydailynews.com/2024/02/17/george-santos-sues-jimmy-kimmel-cameo-fraud-lawsuit/": "articles/George Santos Lawsuit/George Santos sues Jimmy Kimmel, alleges fraud over Cameo clips.md",
    "https://abcnews.go.com/US/wireStory/george-santos-sues-late-night-host-jimmy-kimmel-107323940": "articles/George Santos Lawsuit/George Santos Sues Late-Night Host Jimmy Kimmel for Tricking Him Into Making Videos to Ridicule Him.md",
    "https://nypost.com/2024/02/17/us-news/lyin-expelled-ex-rep-george-santos-makes-jimmy-kimmels-wishes-come-true-by-suing-host-over-misusing-cameo-clips/": "articles/George Santos Lawsuit/Lyin' expelled ex-Rep. George Santos makes Jimmy Kimmel's 'wishes come true' by suing host over misusing Cameo clips.md",
    "https://www.huffpost.com/entry/george-santos-sues-jimmy-kimmel-over-cameo-prank_n_65d12821e4b043f1c0ab5d5e": "articles/George Santos Lawsuit/Ousted Rep. George Santos Sues Jimmy Kimmel Over Cameo Video Prank  HuffPost Entertainment.md",

    # Sam Altman
    "https://www.inc.com/ben-sherry/nvidia-founder-jensen-huang-dismisses-7-trillion-ai-investment-figure-floated-by-openais-sam-altman.html": "articles/Sam Altman 7 Trillion/Nvidia Founder Jensen Huang Dismisses $7 Trillion AI Investment Figure Floated by OpenAI's Sam Altman  Inc.com.md",
    "https://www.pymnts.com/artificial-intelligence-2/2024/openai-ceo-sam-altman-reportedly-pitches-7-trillion-ai-funding-project/": "articles/Sam Altman 7 Trillion/OpenAI CEO Sam Altman Reportedly Pitches $7 Trillion AI Funding Project  PYMNTS.com.md",
    "https://www.cnbc.com/2024/02/09/openai-ceo-sam-altman-reportedly-seeking-trillions-of-dollars-for-ai-chip-project.html": "articles/Sam Altman 7 Trillion/OpenAI CEO Sam Altman reportedly seeks trillions of dollars for AI chip project.md",
    "https://www.tomshardware.com/tech-industry/artificial-intelligence/openai-ceo-sam-altman-seeks-dollar5-to-dollar7-trillion-to-build-a-network-of-fabs-for-ai-chips#:~:text=What%20he%20is%20working%20on,reshape%20the%20whole%20semiconductor%20industry.": "articles/Sam Altman 7 Trillion/OpenAI CEO Sam Altman seeks $5 to $7 trillion to build a network of fabs for AI chips  Tom's Hardware.md",
    "https://arstechnica.com/information-technology/2024/02/report-sam-altman-seeking-trillions-for-ai-chip-fabrication-from-uae-others/#:~:text=Altman%20reportedly%20seeks%20to%20expand,and%20other%20AI%2Dspecific%20chips.": "articles/Sam Altman 7 Trillion/Report Sam Altman seeking trillions for AI chip fabrication from UAE, others  Ars Technica.md",
    "https://economictimes.indiatimes.com/tech/technology/sam-altman-eyes-semiconductor-industry-in-talks-to-raise-nearly-7-trillion-to-boost-ai-chip-production/articleshow/107577394.cms?from=mdr": "articles/Sam Altman 7 Trillion/Sam Altman Sam Altman eyes semiconductor industry, in talks to raise nearly $7 trillion to boost AI chip production - The Economic Times.md",
    "https://www.businessinsider.com/sam-altman-wants-government-backing-7-trillion-ai-chip-venture-2024-2": "articles/Sam Altman 7 Trillion/Sam Altman Wants US Backing for His $7 Trillion AI Chip Venture Report.md",
    "https://www.wsj.com/podcasts/the-journal/sam-altmans-7-trillion-moonshot/d0136c2a-4ba9-4118-b69b-e3ec300c4c82": "articles/Sam Altman 7 Trillion/Sam Altman's $7 Trillion 'Moonshot' - The Journal. - WSJ Podcasts.md",
    "https://finance.yahoo.com/news/sam-altman-7-trillion-ai-212801139.html": "articles/Sam Altman 7 Trillion/Sam Altman's $7 trillion AI chip dream has him rounding on critics 'You can grind to help secure our collective future or you can write Substacks about why we are going to fail'.md",
    "https://www.businessinsider.com/sam-altman-7-trillion-chip-dreams-off-mark-nvidia-ceo-2024-2": "articles/Sam Altman 7 Trillion/Sam Altman's $7 Trillion Chip Dreams Way Off Mark Nvidia's Jensen Huang.md",
    "https://www.theverge.com/2024/2/9/24067205/the-latest-rumor-about-sam-altmans-ai-chip-building-dream-could-require-up-to-7-trillion": "articles/Sam Altman 7 Trillion/The latest rumor about Sam Altman’s AI chip-building dream could require up to $7 trillion. - The Verge.md",
    "https://www.axios.com/2024/02/17/sam-altman-openai-7trillion#:~:text=That%20has%20enabled%20the%20development,bigger%20than%20the%20financial%20ones.": "articles/Sam Altman 7 Trillion/What Sam Altman's chimerical trillions say about AI hype.md",
    # Carlson putin
    "https://slate.com/news-and-politics/2024/02/alexei-navalny-death-tucker-carlson-putin-interview.html": "articles/Carlson Putin/Alexei Navalny’s death underlines the horrors of Tucker Carlson’s Putin interview..md",
    "https://www.cnn.com/2024/02/08/media/vladimir-putin-tucker-carlson-interview-reliable-sources/index.html": "articles/Carlson Putin/Analysis After Tucker Carlson’s softball interview, Putin walks away with propaganda victory  CNN Business.md",
    "https://www.dailymail.co.uk/columnists/article-13066311/BORIS-JOHNSON-Putin-Tucker-Carlson-interview-stooge-Hitler-charade.html": "articles/Carlson Putin/BORIS JOHNSON Putin's interview with his fawning stooge Tucker Carlson was straight out of Hitler's playbook. I pray Americans see through this unholy charade  Daily Mail Online.md",
    "https://www.miragenews.com/full-text-transcript-of-tucker-carlson-putin-1171489/": "articles/Carlson Putin/Full Text Transcript of Tucker Carlson Putin Interview  Mirage News.md",
    "https://www.reuters.com/world/putin-complains-about-lack-piercing-questions-tucker-carlson-2024-02-14/": "articles/Carlson Putin/Putin complains about lack of piercing questions from Tucker Carlson  Reuters.md",
    "https://newrepublic.com/post/179032/even-putin-thought-tucker-carlson-interview-lame": "articles/Carlson Putin/Putin Roasts Tucker Carlson Even More After That Pathetic Interview  The New Republic.md",
    "https://thehill.com/homenews/media/4472304-senate-republican-rips-tucker-carlson-russia-grocery-store-trip/": "articles/Carlson Putin/Senate Republican rips Tucker Carlson over Russia grocery store trip  The Hill.md",
    "https://thehill.com/policy/international/4472914-tucker-carlson-navalny-russia-putin/": "articles/Carlson Putin/Tucker Carlson ‘No decent person would defend’ what happened to Navalny  The Hill.md",
    "https://www.independent.co.uk/news/world/americas/tucker-carlson-putin-navalny-dead-b2497560.html": "articles/Carlson Putin/Tucker Carlson criticised for praising Putin before Navalny death ‘Leadership requires killing people’  The Independent.md",
    "https://www.bbc.com/news/world-europe-68255302": "articles/Carlson Putin/Tucker Carlson interview Fact-checking Putin's 'nonsense' history.md",
    "https://www.newyorker.com/news/news-desk/tucker-carlson-promised-an-unedited-putin-the-result-was-boring": "articles/Carlson Putin/Tucker Carlson Promised an Unedited Putin. The Result Was Boring  The New Yorker.md",
    "https://www.washingtonpost.com/world/2024/02/08/tucker-carlson-putin-interview-released/": "articles/Carlson Putin/Tucker Carlson releases video of interview with Russian leader Putin - The Washington Post.md",
    "https://www.nytimes.com/2024/02/16/business/media/tucker-carlson-putin-navalny.html": "articles/Carlson Putin/Tucker Carlson’s Lesson in the Perils of Giving Airtime to Vladimir Putin - The New York Times.md",
    # Trump Election Fraud
    "https://www.politico.com/news/2024/02/06/trump-indiana-conspiracy-00139973": "articles/Trump Election Fraud/‘Literally off his rocker’ Why Trump is fixated on Indiana - POLITICO.md",
    "https://www.wthr.com/article/news/politics/biden-trump-being-challenged-to-keep-them-off-indiana-ballot-president-primary-may-election/531-5f31bf65-d4a9-4678-b061-8d57cc99ec9d": "articles/Trump Election Fraud/Challenges filed to keep Biden, Trump off Indiana ballot  wthr.com.md",
    "https://www.nytimes.com/live/2024/02/09/us/trump-biden-election-updates": "articles/Trump Election Fraud/Election 2024 Trump blasts decision not to charge Biden in documents case, citing ‘selective persecution.’ - The New York Times.md",
    "https://www.wfyi.org/news/articles/former-president-trump-faces-ballot-challenge-in-indiana#:~:text=The%20challenge%20was%20filed%20with,2020%20election%20to%20Joe%20Biden.": "articles/Trump Election Fraud/Former President Trump faces ballot challenge in Indiana.md",
    "https://www.indystar.com/story/news/politics/elections/2024/02/16/jan-6-subject-of-trump-primary-ballot-challenge-in-indiana/72631205007/": "articles/Trump Election Fraud/Indiana presidential election Jan. 6 cited in Trump ballot challenge.md",
    "https://stateaffairs.com/indiana/elections/indiana-primary-ballot-challenges/": "articles/Trump Election Fraud/Nikki Haley makes Indiana ballot, but others at risk - State Affairs.md",
    "https://fox59.com/indianapolitics/presidential-candidate-nikki-haley-to-appear-on-indiana-republican-primary-ballot/": "articles/Trump Election Fraud/Presidential candidate Nikki Haley to appear on Indiana Republican primary ballot.md",
    "https://apnews.com/live/trump-supreme-court-arguments-updates": "articles/Trump Election Fraud/Supreme Court skeptical of efforts to kick Trump off the ballot  AP News.md",
    "https://apnews.com/article/supreme-court-trump-insurrection-2024-election-0baac5ba0c1868e437e365af17eeab24": "articles/Trump Election Fraud/Supreme Court will decide if Trump can be kept off 2024 presidential ballots  AP News.md",
    "https://www.nytimes.com/interactive/2024/01/02/us/politics/trump-ballot-removal-map.html": "articles/Trump Election Fraud/Tracking State Efforts to Remove Trump From the 2024 Ballot - The New York Times.md",
    "https://www.reuters.com/world/us/trump-address-supporters-after-3549-million-fraud-ruling-2024-02-17/": "articles/Trump Election Fraud/Trump tells supporters his $355 million fraud fine is election interference  Reuters.md",
}