# Owner content needed for the About page

The About page can show a founder profile once the owner supplies enough real, verifiable information. Until then, the public page intentionally omits the unfinished founder block.

## Required to show the founder profile

Update `src/data/owner.ts` with all of these fields:

- `name`: the founder's real public name.
- `role`: the founder's accurate role at Infinite Weblinks.
- `shortBiography`: a short biography in plain English. Include relevant background, why Infinite Weblinks exists and what kind of work the founder focuses on.
- `portraitPath`: a path to a real portrait image in this repository, usually under `public/`.
- `portraitAlt`: concise alt text for the portrait.

The founder profile will not render unless all required fields are present.

## Optional credentials

Add `verifiedCredentials` only for credentials that can be checked. Examples might include current platform certifications, partner statuses or professional qualifications.

Do not add awards, client names, statistics, testimonials or claims unless the owner has permission and evidence.

## Portrait guidance

Use a real owner-supplied photograph. Do not use stock photography or generated people. The image should be suitable for a public business website and should not contain private information in the background.

## Tone guidance

Keep the biography honest and specific. Avoid superlatives such as "award-winning", "world-class" or "best" unless there is documented evidence and permission to publish it.
