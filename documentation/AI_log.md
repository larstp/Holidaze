19 Aug
Reason: Inital commit needed a simple README
Outcome: I had copilot generate a simple folder structure in .md format to have in the README while working on project

25 Aug
Reason: Needed help choosing correct file type for Web font
Outcome: Woff2 it is!

26 Aug
Reason: unsure of how to properly/cleanly split up the different API services
Outcome: suggested a pure per-service split

27 Aug
Reason: Needed help understanding new-image-on-refresh setup. Could not get it to work.
Outcome: Set window.matchMedia('(prefers-reduced-motion: reduce)'); and added two consts for timer and image gallery. I also always get confused when there are brackets within brackets within brackets, so i got help fixing that here.

3 Sep
Reason: Could not figure out how to "randomly" display items (I really struggle with the math functions in JS and TS)
Outcome: Showed me this setup:
const shuffledVenues = [...venues];

for (let index = shuffledVenues.length - 1; index > 0; index -= 1)
const randomIndex = Math.floor(Math.random() * (index + 1));
[shuffledVenues[index], shuffledVenues[randomIndex]] = [
shuffledVenues[randomIndex],
shuffledVenues[index],]
Explained how to implement it and I managed!

3 Sep
Reason: Needed help implementing loader form external source. couldn't get it to show.
Outcome: Assisted in properly inserting the hook on the page.

Sep 3
Reason: Tried my hands on the location implementation from the API but encountered only errors. Needed help troubleshooting
Outcome: Found out its lat: number | null;, and not lat: number;

Sep 3
Reason: Had it suggest icons for different fields from my icon lib as there were hundreds to look through
Outcome: Found a handful of icons I can use throughout the webpage

3 Sep
Reason: Wanted to implement a review section, as i can see reviews on all travel websites im visiting. Cant find it in the API, and i was toying with the idea of finding a random free review API, but all of them were for e-commerce so it would have looked weird.
Outcome: Used up ALL my tokens for this month while helping me generate a JSON with a bunch of mock reviews that i can link to to simulate reviews. Now i feel that i HAVE to use it

4 Sep
Model: Google Gemini Free
Reason: Could not het image fallback to not throw error and didnt understand error message.
Outcome: helped me set up the "ImageWithFallbackProps" properly (i had formatted it all wrong)
