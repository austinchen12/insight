# Kaleido 🦎

## Inspiration ✨

In a world saturated with information and misinformation, the upcoming 2024 presidential election stands as a testament to our need for clarity and truth. This is where Kaleido steps in. Inspired by the vision of bringing light to the unseen, our mission goes beyond merely summarizing news content. We dive deeper, revealing not just what you're reading, but also what you're missing out on. Additionally, by assessing bias and sentiment across related articles, Kaleido provides a fuller, more balanced view of every story 📚.

Our approach is grounded in the belief that understanding the full spectrum of information is crucial in navigating the complexities of today's world. Kaleido is not just a tool; it's a movement towards informed, critical thinking and a beacon for those who seek to understand beyond the surface 🚀.

## What Kaleido Does 🛠️

Kaleido is a Chrome extension designed to seamlessly integrate into your browsing and reading experience. It works in the background as you explore news articles, leveraging vector embedding search technology to analyze the content of your current article. After identifying similar articles discovered by other users through embeddings, Kaleido offers a unique comparative analysis of the article at hand.

The core functionality of Kaleido is twofold:

1. **Comparative Analysis**: Kaleido enables users to compare the bias and sentiment of the current article with a wide array of other similar articles identified by its vector embedding search. This feature allows for an in-depth understanding of where the article stands, in bias and sentiment, within a broader spectrum of perspectives and analyses 📊.

2. **Idea Aggregation and Analysis**: The second key feature distills the essence of an article into multiple points or ideas, and each point is then embedded in vector space. This process constructs a vast network or a "superset" of ideas shared across articles, identified as clusters of similar thoughts in the vector-embedded space. Through this approach, Kaleido surfaces significant, overarching takeaways from these groups of articles, offering a comprehensive view that goes beyond the surface level 🔍.

Additionally, Kaleido aggregates crucial insights by comparing the focal points of an article against others, enriching the user's understanding with enhanced data on embeddings, sentiment, and bias. This not only broadens the perspective of readers but also deepens their engagement with content, fostering a more informed and critical approach to information consumption 🌐.

## Why We Built Kaleido 🏗️

Since our team's convergence at TreeHacks, the driving force behind Kaleido has been a deep-seated interest in education and politics, with a spotlight on the impending 2024 election. This particular moment in time underscores the paramount importance of clarity, truth, and context in media consumption. Our decision to bring Kaleido to life stemmed from a desire to make a meaningful impact within the media space, guided by the principle that the quality of input fundamentally shapes the quality of output 🌟.

In crafting Kaleido, our ambition was to elevate the caliber and context of the information we consume. We recognized that in an era where information is both weapon and tool, enhancing the input quality—by providing a more nuanced, comprehensive understanding of the news—can significantly influence our perceptions, decisions, and, ultimately, our societal output. Our hope with Kaleido was to optimize this input process, fostering a more informed, discerning, and engaged populace, especially in the context of critical events like elections, where the stakes are incredibly high 🗳️.

## How We Built Kaleido 🛠️

From the start, we knew that building Kaleido would be a complex adventure with a lot of moving parts. The project ended up being particularly complicated, especially with the employment of multiple embeddings and clustering. However, although Kaleido embeddings seem particularly scary, we were very lucky to have sponsored technology that significantly streamlined our development process 🤖.

**Unified Database Solution**: Perhaps one of the most significant achievements in our development process was the integration of a vector database that allowed us to consolidate our data storage needs into a single, versatile database, provided by InterSystems IRIS Database. This eliminated the necessity for multiple databases, streamlining our data management and enhancing the efficiency of our operations 📈.

**Front-End and Back-End Synergy**: The architectural foundation of Kaleido was a harmonious blend of front-end and back-end technologies. Our Chrome extension, developed using Plasma and React, was intricately designed to offer a user-friendly interface and a responsive user experience. The backend, powered by Bun, facilitated a REST API in a monorepo setup, enabling seamless type sharing with the front-end and ensuring a cohesive development environment 💻.

**API Development**: To facilitate seamless communication between our Chrome extension and the backend, we opted for Bun with Elysia. Elysia is a highly ergonomic web framework, with an API like express, for building backend servers, but specifically designed to run in the Bun runtime 🌍.

## Challenges we ran into 🚧

From our initial ideation, we realized quickly that our application was nowhere near as simple as we initially thought and we brainstormed a lot to think and address these complexities before coding.

One significant hurdle was the process of acquiring and scraping articles, a task made increasingly difficult by the recent rise of anti-scraping measures implemented by many websites 🛑.

However, the true test of our resolve was the spontaneous decision to incorporate clustering into Kaleido. This idea, born from the brainstorming sessions aimed at addressing our project's growing complexity, introduced a new level of challenge since nobody on our team had any familiarity with how to do it. Achieving proficiency required not just technical acumen but a willingness to dive into uncharted waters 🌊.

## Accomplishments that we're proud of 🏆

Similar to the previous sections about the challenges we ran into, we're quite proud of the challenges that we have overcome. Particularly, during our brainstorming session, we went from a half-baked idea with very little development into one which had many moving parts and complexity, and all thanks to a few hours of brainstorming that we set aside at the very beginning of the weekend. In addition, we are particularly happy about how we had spontaneously stumbled upon the idea of clustering—until then, nobody in our group had done it before, but it just felt like the right word describing what we wanted to do. Finally, we're very happy with how the logo and the user interface turned out. It turned out to be far better than we ever would have imagined 🎨.

## What we learned 📚

The importance of brainstorming and thinking things through before implementation. Although our team was formed relatively late, we were able to avoid a lot of bumps by taking an hour at the beginning to think and brainstorm and concretely write down our implementations before coding them.

Additionally, we really enjoyed engaging with new technologies and learning how to cluster! 🌟

## Conclusion 🎉

Developing Kaleido was a pleasure, and our team really enjoyed working together, learning new technologies, and making new friends.

Now, we hope you will join us in our quest to illuminate the unseen, enhance your reading experience, and equip you with the insights needed to face the misinformation challenge head-on. Together, let's create a more informed society ready to make educated decisions for the future 🌍.

## Creators 👨‍💻

- **Austin Chen**
- **Braden Wong**
- **Joe Zakielarz**
