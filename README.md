# crunchyroll-queue-condense
Source for a chrome extension to hide up-to-date shows in the crunchyroll queue

Disclaimer: I'm a python developer. I apologise in advance for my terrible js practices.

###Background###
I watch a ton of shows on crunchyroll, but I don't like removing things from my queue after I finish (because it _might_ just get a second season). I order my queue by how much I like the shows, so finished shows stay at the top. 

After a few years, it's getting annoying to scroll down to get to my actively watched shows. So, I created this chrome extension to make my life easier.


###Installation###
 - Download the condense_queue folder
 - Enable chrome developer mode in the extensions tab
 - Load unpacked extension pointing to condense_queue

 
###Usage###
Crunchyroll queue shows the last watched episode if there are no new episodes, or the next episode after the one you've watched. The condense takes advantage of this by looking at the progress bar on the episode the queue shows. If it is >= 80%, it will consider the episode fully watched and will hide it.

All hidden shows can be seen below the "Recently Watched" section of the right sidebar. Clicking on the shows here will toggle visibility of the show (so you can rearrange them in the queue or if you hadn't actually finished the episode, or were re-watching an old one)


###Known Issues###
 - **>=80% doesn't quite work for shorter (5 minute) shows if you don't watch the ending song**
 - **Re-watching old episodes aren't handled by this extension (either the completion percent is low for rewatching a single scene, or it shows the next episode, but not the latest one for the show).**
 
 Since this is due to Crunchyroll's queue behavior (and the extension itself is very basic - relying on the elements loaded by the queue without making additional requests), no updates are planned.
