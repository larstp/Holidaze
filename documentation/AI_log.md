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

Sep 7
Model: Google Gemini Free
Reason: Wanted help planning out the proper way to split up a search function as I felt it always turned into a big mess file-wise.
Outcome: ended up on this setup, which i will try to implement now:

src/
├── pages/Search/
│ ├── Search.tsx
│ └── Search.module.css
├── hooks/
│ ├── useSearchVenues.ts
│ └── useSearchFilters.ts
├── lib/services/
│ └── venueService.ts
├── lib/helpers/
│ └── venueHelpers.ts
└── lib/constants/
└── api.ts

Sep 7
Model: Google Gemini Free
Reason: Wanted to implement a venue badge for "Guest favourites" etc ubt wasnt sure how it could be done with the limited API info.
Outcome: Helped me set up "venue.rating >= 4.8 && (venue._count?.bookings ?? 0) >= 3" that spoofs a "popular" tag.

9 Sep
Model: Google Gemini Free
Reason: Could not get the search query to properly use availability filtering and not have a bunch of overlap
Outcome: helped me set up a messy booking.dateFrom < selectedDateTo AND booking.dateTo > selectedDateFrom. will clean up later. also got help setting up the hasCompleteDateRange const

9 Sep
Model: Google Gemini Free
Reason: a LOT of troubleshooting the page loader animation
Outcome: managed to insert it inline

9 Sep
Model: Google Gemini Free
Note: MAJOR HELP
Reason: I had a TONNE of problems regarding the search filtering and importing the venues properly to the search and home page. It was only importing the first 15 venues, and whenever i searched for locations that i KNEW there were hundreds of it still only showed me like 4 max.
Outcome: I realized i only imported the first API page which probably came when i inserted the pagination rule, but at this point i had written so much around it that i struggled moving things around and changing it so that it would import ALL of it. I sat up the useAllVenues.ts hook and got help converting and moving where needed so that the new hook could be used

10 Sep
Model: Google Gemini Free
Reason: Had worked a lot on the venue page and pushed to the branch, but discovered while working on the signup page that the network had been down for hours and the branch had not in fact been properly pushed (it must have happened as the network went out). had an enormous amount of git problems merging the non-synced branch i was on with a half pushed venue branch etc. so I had major help in fixing and merging them into one big push
Outcome: copied a bunch of files around and managed to clean up the codespace with help from the LLM, then made a clean way-too-big push

12 Sep
Model: Google Gemini Free
Reason: Had problems with authenticated users not being stored properly or wrongly. displayed wrong fallback images and everything was in a "half state" between logged in and not. Needed MUCh help debugging.
Outcome: Read about client-side JWT claim parsing and got help implementing that. These things were very confusing and i wish we had more actual debugging in our courses because i feel lost easily, especially in TS. Thats where i at least get good debug help from gemini

12 Sep
Model: Google Gemini Free
Reason: Needed corpo-jargon copy for a couple of pages
Outcome: Generated text examples i could use in "Become a manager" page ++

14 Sep
Model: Google Gemini Free
Reason: Needed help displaying the correct dates in the bookingList item. I really struggle with Math..
Outcome: Managed to implement it, i think i understand but I'll probably forget again like I do every time..
