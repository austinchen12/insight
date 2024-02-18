In the 2nd edition of his 1999 masterpiece [In The Blink of An Eye](https://www.amazon.com/Blink-Eye-Perspective-Film-Editing/dp/1879505622/), legendary film editor Walter Murch proposed a thought experiment: “Let’s suppose a technical apotheosis sometime in the middle of the twenty-first century, when it somehow becomes possible for a single person to make an entire feature film, with virtual actors.” 

With the unveiling of Sora from OpenAI, humanity is inching closer to Murch’s hypothetical.

Sora is a text-to-video model OpenAI has been working on over the past year that can generate up to a minute of HD, 1080p video from a text prompt.

It’s the latest [text-to-video model](https://www.freethink.com/robots-ai/googles-lumiere-has-created-a-new-paradigm-for-text-to-video-ai) in an increasingly crowded subset of the broader generative AI landscape, joining [Gen 2 by Runway](https://research.runwayml.com/gen2), [Pika from Pika Labs](https://pika.art/login), and [Emu from Meta](https://ai.meta.com/blog/emu-text-to-video-generation-image-editing-research/). OpenAI says, “Sora is capable of generating entire videos all at once or extending generated videos to make them longer.” The model can also utilize still imagery to generate a video. 

[On its website](https://openai.com/sora), OpenAI shared 48 examples of videos generated from Sora that the company claims contain no modification or touching up.

OpenAI also released a technical paper, “[Video generation models as world simulators](https://openai.com/research/video-generation-models-as-world-simulators),” detailing how Sora works. Lior S. of the AlphaSignal newsletter has a helpful breakdown of the technical aspects of how the model works.

> BREAKING: OpenAI announces Sora, a new text-to-video model.
> 
> It can generate 1 min long high quality video that already rivals Runway.
> 
> Sora is currently being tested by experts to identify any risks or problems.
> 
> No paper yet but here's what we know about the architecture:  
> \-… [pic.twitter.com/HFAxyx9HVL](https://t.co/HFAxyx9HVL)
> 
> — Lior⚡ (@AlphaSignalAI) [February 15, 2024](https://twitter.com/AlphaSignalAI/status/1758200381887164531?ref_src=twsrc%5Etfw)

One of the most interesting aspects of Sora is its use of patches, small collections of data that are similar to the “tokens” that underlie its ChatGPT models. “At a high level, we turn videos into patches by first compressing videos into a lower-dimensional latent space, and subsequently decomposing the representation into spacetime patches.” Spacetime patches are spatial (visual) and temporal (time) information within a video sequence. 

> Building models that can understand video … is an important step for all future AI systems.
> 
> Tim Brooks

Patches allow Sora to break up a video or an image into smaller chunks that are analyzed and processed separately. This reduces the complexity of analyzing the visual information in a particular video or image. Visual data like video and images are known as “high-dimensional” data. For example, an image with 1000×1000 pixels has 1 million dimensions. Processing that many dimensions is computationally expensive. By reducing a video or image into smaller patches — or rather into this _lower_\-dimensional latent space — you can improve a model’s performance by allowing it to focus on the variance between different patches.

![A diagram of a cube.](https://www.freethink.com/wp-content/uploads/2024/02/Sora_1.jpg?quality=75&w=1622)

Credit: OpenAI

OpenAI describes Sora as a diffusion transformer model that makes video by gradually transforming compressed static noisy patches over many steps. 

![A group of houses in a small town.](https://www.freethink.com/wp-content/uploads/2024/02/Sora_2.jpg?quality=75&w=1263)

Credit: OpenAI

In addition to patches, OpenAI applied the “re-captioning” technique used with DALL-E 3 to give Sora a training set of videos with corresponding text captions. “We first train a highly descriptive captioner model and then use it to produce text captions for all videos in our training set. We find that training on highly descriptive video captions improves text fidelity as well as the overall quality of videos.” Sora also utilizes GPT technology to turn the user’s short prompts into longer, more detailed prompts, a technique the company also used with DALL-E 3.

OpenAI has yet to disclose the precise training data for Sora, but Jim Fan, a Senior Research Scientist at NVIDIA, suggested that he “won’t be surprised if Sora is trained on lots of synthetic data using Unreal Engine 5.”

> If you think OpenAI Sora is a creative toy like DALLE, … think again. Sora is a data-driven physics engine. It is a simulation of many worlds, real or fantastical. The simulator learns intricate rendering, "intuitive" physics, long-horizon reasoning, and semantic grounding, all… [pic.twitter.com/pRuiXhUqYR](https://t.co/pRuiXhUqYR)
> 
> — Jim Fan (@DrJimFan) [February 15, 2024](https://twitter.com/DrJimFan/status/1758210245799920123?ref_src=twsrc%5Etfw)

Fan made this prediction before OpenAI released the technical paper for Sora. While the paper did not specifically discuss Unreal Engine, the paper did mention Sora’s ability to simulate digital worlds. The model can create high-fidelity simulations of [Minecraft](https://www.freethink.com/technology/urban-planning), the popular open-world video game from Mojang Studios. OpenAI believes “these capabilities suggest that continued scaling of video models is a promising path towards the development of highly-capable simulators of the physical and digital world, and the objects, animals and people that live within them.”

Sora is yet to be released to the public, but as is becoming the norm in the rollout of new GenAI products, the company has granted early access to a small number of creative professionals for feedback about its performance. OpenAI is also working with [red teamers](https://www.freethink.com/robots-ai/chatgpt-jailbreakers) — the white-hat hackers of the AI world — to test the model’s guardrails in an adversarial manner to help ensure Sora doesn’t generate “extreme violence, sexual content, hateful imagery, celebrity likeness, or the IP of others.” 

Following the announcement of Sora, OpenAI CEO Sam Altman began posting examples of Sora-generated videos based on prompts supplied by X users. “We’d like to show you what Sora can do,” Altman posted. “Don’t hold back on the detail or difficulty!”

> we'd like to show you what sora can do, please reply with captions for videos you'd like to see and we'll start making some!
> 
> — Sam Altman (@sama) [February 15, 2024](https://twitter.com/sama/status/1758193792778404192?ref_src=twsrc%5Etfw)

In many ways, Sora feels like an early iteration of Walter Murch’s vision. In his book, Murch imagines this technology as a “black box” that could “directly convert a single person’s thoughts into a viewable cinematic reality. You would attach a series of electrodes to various points on your skull and simply think the film into existence.” He asks his audience to consider whether this would be “a good thing.”

While the direct mind-reading Murch describes is far from reality (although remarkable [progress is happening](https://ai.meta.com/blog/brain-ai-image-decoding-meg-magnetoencephalography/) there, too), the chat box is conceivably the precursor to Murch’s black box input. In his thought experiment, Murch describes this device as diabolical and believes that future filmmakers would be making a Faustian bargain if they accepted the trade-offs offered by such a powerful piece of technology.

It seems that Murch was ahead of his time here, too. Some people online decried the Sora announcement as the end of filmmaking and Hollywood, claiming that the new technology has “stolen the future” of aspiring young filmmakers.

> AI will most likely lead to the end of the world, but in the meantime, we'll get to watch great movies.
> 
> Impressive technology, but spare a thought for those young people currently entering the film industry, who certainly will have recognized that OpenAI has stolen their future. [https://t.co/SswHq7zEhL](https://t.co/SswHq7zEhL) [pic.twitter.com/dCDzJcWgva](https://t.co/dCDzJcWgva)
> 
> — Tolga Bilge (@TolgaBilge\_) [February 15, 2024](https://twitter.com/TolgaBilge_/status/1758228615311798774?ref_src=twsrc%5Etfw)

But others were thrilled by the announcement, viewing Sora as a democratizing force for creativity that allows people with ideas to overcome technical and bureaucratic barriers that currently stand in their way. 

> Cinema – the most prohibitively expensive art form (but also the greatest and most profound) – is about to be completely democratized the way music was with DAW's.
> 
> (Without DAW's like ableton, GarageBand, logic etc – grimes and most current artists wouldn't exist). [https://t.co/CjIfv46VLB](https://t.co/CjIfv46VLB)
> 
> — 𝖦𝗋𝗂𝗆𝖾𝗌 ⏳ (@Grimezsz) [February 15, 2024](https://twitter.com/Grimezsz/status/1758259235014738195?ref_src=twsrc%5Etfw)

As a filmmaker, I fall into the latter camp. I am much more _excited_ by the prospects of new tools for storytelling that allow more people to tell the stories they wish to tell. While newer, fancier tools can help ease the process of making art, it would be a mistake to confuse a tool _with_ art. As tools become easier for non-experts to use, we are sure to see a proliferation of bad art. The last two decades of digital media provide ample examples of bad art that is only possible because the tools of the craft are more widely accessible. 

But we’ve also been blessed with an explosion of good art made by people who wouldn’t have been able to participate in the creative process under previous circumstances. Personally, what excites me about an innovation like Sora is the idea of being able to ideate around stories, isolated from other technical aspects of the current filmmaking process. Iteration and revision are necessary for making good films, but the cost of iteration, especially _visual_ iteration, is a barrier that can leave many good ideas unexplored.

> I’d personally rather have, see, and share more ideas than fewer ideas.

The ideation process is one of the most joyful parts of filmmaking, and the fact that humanity is building tools that can help rapidly turn ideas into reality is fundamentally exciting. That doesn’t mean that there aren’t trade-offs, that there aren’t things we might lose in the process, but I’d personally rather have, see, and share more ideas than fewer ideas.

While Sora is inching humanity closer to the “black box” described by Murch, one of the biggest barriers to the creation of a Murch-ian device, which could allow a single person’s vision to be turned directly into film, is that these models can still struggle generating complex scenes accurately. Despite the model’s technical achievements and impressive demonstrations, OpenAI notes that Sora struggles with things like cause and effect, as well as confusing spatial directions like right and left. The company provided five examples of where Sora currently struggles with complex scenes.

Even with its current shortcomings, the company believes that Sora could be a game-changing model that could lay the foundation for AGI. Tim Brooks, a scientist at OpenAI, told [MIT’s Technology Review](https://www.technologyreview.com/2024/02/15/1088401/openai-amazing-new-generative-ai-video-model-sora/), “We think building models that can understand video, and understand all these very complex interactions of our world, is an important step for all future AI systems.”