# Contributing

## 📢 Meetup Call For Proposals (CFP)

Are you thinking about doing a talk or presentation at an upcoming [Astoria Tech Meetup](https://www.meetup.com/astoria-tech-meetup/)? Then you've come to the right place! Open a github issue or chat with @reggi to discuss a proposal!

## 🛝 Submitting your slides

We've tried to streamline and automate much of the submission process, this allows you to:

1. Submit your name
2. Submit your profile image for our meetup.com image and projected image the night of the event
3. Submit your slides to the community for later use, (distributed via rss on our static site)

The content for this repo is in yaml frontmatter at the top of a few markdown files. The [content folder is here](https://github.com/astoria-tech/meetup/tree/main/src/content). The `schema` or properties are [defined in this config](https://github.com/astoria-tech/meetup/blob/main/src/content/config.ts).

In order to submit a talk you need a couple key things.

> Note: `YYYY-MM-DD` is the date of the event that you'll be speaking at.

- [ ] A `speaker` file located in [`/src/content/speakers`](https://github.com/astoria-tech/meetup/tree/main/src/content/speakers) (eg `{your-name}.md`) or use this issues template to create a [`speaker` profile here](https://github.com/astoria-tech/meetup/issues/new?assignees=%40reggi&labels=speaker&projects=&template=speaker_submission.yml&title=%5BSpeaker%5D+).
- [ ] A `presentation` file located in [`src/content/presentations`](https://github.com/astoria-tech/meetup/tree/main/src/content/presentations) (eg `YYYY-MM-DD-{your-name}.md`) or use this issues template to create a [`presentation` file here](https://github.com/astoria-tech/meetup/issues/new?assignees=%40reggi&labels=presentation&projects=&template=presentation_submission.yml&title=%5BPresentation%5D%3A+)
- [ ] A `pdf` file of your presentation located in [`public/presentations`](https://github.com/astoria-tech/meetup/tree/main/public/presentations) (eg `YYYY-MM-DD-{your-name}.pdf`) (a PR needs to be made to get the PDF into the repo)
- [ ] The last step is to add your presentation to the `event` (it may not exist, if not you can create it or this can be done by the repo maintainer via workflow dispatch) [here's an example](https://github.com/astoria-tech/meetup/blob/main/src/content/events/2024-04-03.md?plain=1#L6), there's a `presentations` array within each event and you're presentation file basename should be added to this list (eg. `YYYY-MM-DD-{your-name}`).
