## About

Salesforce Go is an in-product onboarding experience that helps customers discover, implement, adopt, and measure features. The goal is for Salesforce Go to be the single, trusted destination for customers to quickly realize value from their entire Salesforce investment. CX contributes to that goal by providing UI text and CDX support, plus curating, creating, and consulting on the content assets that are included in the Salesforce Go product.

## UI Text Guidelines and Page Hierarchy

### Overview

The standards and guidelines for each Salesforce Go page and components are in the Salesforce Go Component Library. Also, we now have Agentforce UI text guidelines for Go! NEW

Here’s what’s included:
- Guidance on the purpose and message of specific UI text.
- Specific rules for character counts, capitalization, and more.
- Examples, where appropriate, of UI text that meets the guidelines.
- Mention of what UI text is editable and what’s not.
- Guidelines on selecting assets.

You can also view the Salesforce Go Component Library in presentation format. To see all of the Salesforce Go pages and components, flip through using the controls at the bottom of the screen. Watch the demo video to learn how to navigate through the standards in Figma.

Note: Some areas of Salesforce Go are still undergoing design, naming, and UI text standards refinement. We'll continue to update screenshots and UI text standards, as needed.

### Page hierarchy

- Home: Overview of the org with list of feature sets and individual features. The home page text is written by the central Go CDX/CX writer team. Feature set titles and descriptions are populated from Feature Set pages written by CX writers from individual clouds.
- Feature Set: Focus on the job-to-be done with a list of individual features. The text is written by the CX writer who works on the feature or in the product area. PM or Marketing provides content assets.
- Standard Feature: Details about the individual feature and how to set it up. The Feature page has different flavors, depending on the state of the feature in the org. For example, whether the org has already purchased the feature, if the feature has/hasn’t been configured, etc. The text and content assets are gathered by the PM and the CX writer who works on the feature or in the product area. Cloud Content Strategists may also get involved with asset selection or review. See the guidelines in Figma for more details.
- Agentforce Feature: Agentforce feature pages in Go are a bit different, because their configuration is also different from a standard feature. For example, all the Agentforce for Sales agent templates are combined in one feature page. Agentforce for Service takes a similar approach. Just note that your cloud’s Agentforce page may be unique, and ask questions if you have them.

NEW: Agentforce UI text guidelines are now available! NEW

### Salesforce Go Home Page

- What: Overview of Salesforce Go with a curated list of features and feature sets specific to the org. All UI text on the Go home page is considered Framework text and isn't editable, but there are places where the feature name will be populated in a label. Feature Set cards and Feature Cards are auto-populated on the home page from the UI text on the feature set and feature pages.
- Who: The Salesforce Go home page is owned by the central Go CDX and CX writer team: Fiona Moriarty, Nathalie Barclay, Carolyn Clancy, and Nibedita Priyadarshinee. No direct writer involvement is required, as most labels, such as feature set cards, are pulled from other sources.
- Designs and Guidelines: Salesforce Go Home Page Guidelines (Figma)

### Feature Set Page

- What: A feature set page focuses on a Job to be Done (JTBD) and groups together individual features that support it. It includes feature set name (title), feature set description, and some may have a marketing content asset in the “Suggested Asset” section. Features and their text are auto-populated with metadata specified by the engineering team. The marketing content asset is shown on the feature set page only, and is provided by PM and Product Marketing. Feature sets can be either cloud-specific, or cloud-agnostic. See more specific feature set naming direction from Go Product Management on naming relative to these two types. Each feature set is shown as a feature set card on the home page, and the content is auto-populated.
- Who: PM and PMM lead the creation of the feature set pages, and CX helps finalize the UI text. When your cloud creates a new feature set, work with your product managers, and marketing and research partners, to get the details about the feature set so you can create the JTBD text.
- Designs and Guidelines: Feature Set Guidelines (Figma)

### Feature Page

- What: Details about the individual feature, its benefits, and how to set it up. Each feature (product) has a page that provides admins with the ability to learn more about the features, turn it on, and do some feature configuration. Many features have configuration steps remaining on their existing Setup pages that are outside of Salesforce Go. Admins are directed to those pages when needed. Feature pages also include content assets, such as help topics, videos, Trailhead modules, and release notes.
- Note: The Feature page has different flavors, depending on the state of the feature in the org (sometimes referred to internally as the Enhanced Feature Page):
  - Enhanced Feature Page State — Feature Not Purchased Yet (Not Owned): Shown when the feature isn’t available within the org, but is available for purchase.
  - Enhanced Feature Page State — Feature Purchased (Owned): Shown when the feature is available in the org, but it hasn’t been turned on.
  - Enhanced Feature Page State — Turned On and Configuring: Shown after an admin clicks Get Started in the header, and until the feature is fully configured. Each purple section in examples is replaced with standard feature components.
  - Enhanced Feature Page State — On, Configured, and Monitoring: Shown after the feature is fully configured and assigned to users for use. Each purple section in examples is replaced with standard feature components.
- Who: Cloud PMs, UX and eng teams can create a proof of concept of their feature page in the framework and submit it to central Go UX for review and feedback. Writers may want to see the design to get an idea of the UI text requirements, if they are writing UI text for the page.
- Designs and Guidelines: Feature Guidelines (Figma)

#### Enhanced Feature Page — Benefits Section

- What: Optional (recommended) section to “sell” features to admins and other users considering activation. Supports image and text and can host 2–4 benefits. Pre-activation, displayed below the header. Post-activation, moves below configuration.
- Who: Cloud PMs determine which feature benefits to include; CDX and CX write UI text and submit to central Go CX for review.

UI Text Guidelines and Standards:
- Title is optional; description is required.
- A title for the entire component is optional (“Show Title”).
- Highlight 2–4 benefits of the feature.

Sub-Section Components:
- Benefit: includes an image, title, description, and link. Title and description are required; image and link optional.

Titles:
- 8 words or less; verb phrase, sentence case.

Descriptions:
- One sentence, no more than 20–25 words.
- Avoid marketing/vague language; be concrete with minimal jargon.

Examples of benefit content to highlight:
- Business benefits, role benefits, benefits to admin, KPIs, use cases/examples.

Assets:
- Links in the header are optional. Follow CX UI text guidelines for link text.

Graphics:
- Use graphics provided by the CX Graphics team (only).
- With graphics: 3 benefits (required). Text-only: 2–4 benefits.
- Don’t use screenshots.
- Note: New graphics request process for 260 to come.

### Agentforce Feature Page

- What: Details about the agent, its skills and benefits, and how to set it up. Each agent, such as Sales Agent and Service Agent, has a page that provides admins with the ability to learn more about what the agent offers, turn it on, and access agent configuration. Agentforce Feature pages in Go differ from standard feature pages (for example, all Sales agents combined in one page with sections for different agent templates).
- Who: Cloud PMs, UX, and eng teams create a proof of concept of their feature page in the framework and submit it to central Go UX for review and feedback. Writers should see the design to understand UI text requirements when writing for the page.
- Designs and Guidelines: Guidelines to come.

Agentforce Feature Page States:
- Not Turned On: Shown when Agentforce is available in the org, but it hasn’t been turned on.
- Turned On and Configuring: After activation, each agent template has its own configuration card on the page. Implementations vary by Cloud; collaborate with Content Design/UX and ask questions as needed.

## Release Notes and Help Topics About Go

### Release Notes About Go (258+)

Salesforce Go is no longer “new” in 258. Guidance differs from the initial 256 launch.

Scenarios and guidance:

1) It’s the first release your cloud has any features in Go
- Add a single release note in your cloud section announcing that Go is available for your cloud. Include minimal details about Go and a See Also link to the main Help page about Salesforce Go.
- Sample copy (update with your cloud name):
  - Title: Simplify {Cloud Name} Feature Discovery and Setup
  - Shortdesc: With Salesforce Go, you can discover, set up, configure {cloud} features, and track feature usage, all from a single location in Setup. Learn more about features and get help with configuration by accessing content resources and links. Explore more {cloud} products and features, and if you’ve turned on the Your Account app, you can purchase add-on licenses for some features directly from Salesforce Go.
  - Why: Optionally include a screenshot that highlights the feature or feature set for your cloud in Go
  - See Also: Salesforce Help: Feature Set Up and Discovery with Salesforce Go — link to [Feature Set Up and Discovery with Salesforce Go](https://help.salesforce.com/s/articleView?id=xcloud.setup_salesforce_go.htm&type=5) (follow your Release Notes link format)
- Recommendation: Don’t list all features now available in Go. Let admins explore in-product. Avoids support questions and patch maintenance.

2) Your cloud had features in Go in a prior release
- Optional: Add one release note in your cloud section that tells the story of what changed in Go this release (do not enumerate every feature).
- Example stories:
  - Initial Setup that automates enabling many features at once
  - Built out configuration steps in Go (fewer redirects to legacy Setup)
  - New feature set addressing a key job to be done
  - Agent setup added in Go
  - Solution bundle to automate setup of a particular or foundational set of features
- Constraints:
  - One release note per cloud about Go per release
  - Focus on the value story, not feature counts

3) Your feature is new and never had an old‑style page in Setup
- Don’t create a separate “available in Go” note. Instead, add language in the feature’s own release note:
  - How: To turn on [XYZ feature], go to the [feature name] page in Salesforce Go.

Special additions for Solutions:
- Multiple solutions:
  - To quickly realize the value of {Cloud Name} features, deploy preconfigured solution bundles in Salesforce Go. With just a few clicks, install the metadata, data, and integrations required to get the solution up and running. Solutions are available for {solution name/purpose}, {solution name/purpose}, and {solution name/purpose}.
- One solution:
  - Deploy preconfigured solution bundles to {product area business value}. With just a few clicks, install the metadata, data, and integrations required to get the solution up and running.

### Help Topics About Go

- A central Help topic about Salesforce Go lives in the Setup and Maintain Salesforce Organization bundle (available starting in 256). That topic should be the single place with details on using/navigating Go.
- Optionally, add one topic to your cloud bundle highlighting the advantage of using Go and pointing to the central Setup bundle topic. Keep it general and evergreen; don’t duplicate the central topic’s details.
- Sample copy (update with your cloud name):
  - Title: Discover and Set Up {Cloud} Features With Salesforce Go
  - Short Description: Explore, set up and configure, and monitor usage of {cloud} features in one streamlined setup location. Access content resources, such as videos, online tours, Trailhead, and Salesforce Help articles, to learn about features, and get help with configuration. Discover more {cloud} features and add-on licenses that are available based on your Salesforce edition. And if you’ve turned on the Your Account app, you can quickly buy add-on licenses for some products directly from Salesforce Go.
  - See Also: Discover and Set Up Features With Salesforce Go — link to [Discover and Set Up Features With Salesforce Go](https://help.salesforce.com/s/articleView?id=xcloud.setup_salesforce_go.htm)
  - Alternate title: Explore and Set Up {Cloud} Features With Salesforce Go

## Other Help Topic Considerations

Key practices for Help topics referenced from Go, or about features included in Go:

- Don’t document setup via Go step-by-step. Unless the feature’s setup node launches Go, don’t instruct admins to navigate to Go first. For new features whose setup is only accessible from Go, add a setup topic indicating availability in Go, but avoid documenting UI navigation/steps. If more guidance is needed, provide a conceptual topic that explains required pieces and choices.
- Add a Note (Tip) about Go availability to setup task topics. Recommended: insert a Tip using the Global Resource file below (under the permissions table, before the procedure in task topics):
  - Global Resource file: `//dev/doc/content/<branch>/products/resources-global/help/en-us/crosscloud/resources/resource_salesforce_go.xml` (ID: `tip_available_in_go`)
- Add an XML comment if a topic is linked from the app. Example:
  - This topic is linked to from the Go UI. Before deleting, renaming, or changing its title, check with the Go lead writer for [ Sales ] or the team’s content strategist.
- Identify and plan topic enhancements as needed:
  - Align topic titles for consistency
  - Clarify whether “Considerations” are for setup vs usage (or split them)
  - Migrate implementation guide content from PDF to HTML where possible
  - Verify accuracy in older topics (UI text, screenshots, steps)

## Content Assets — Enhanced Feature Page Header

The feature page header contains a combination of text and visual assets that introduce the feature.

### Sticky Header Behavior *(Feature Pages)*

The feature page header implements dynamic sticky behavior that affects content visibility:

- **Full State**: Complete header content including screenshot, title, description, and breadcrumbs
- **Compact State**: Condensed header with hidden screenshot and reduced padding for optimal scrolling experience  
- **Content Rules**: All required assets (screenshot, video, etc.) must still be provided as per normal rules
- **Design Consideration**: Screenshots should be designed knowing they will be hidden in compact state during scrolling

### Screenshot

Single snapshot of a feature’s UI with circled highlights for important points.

- Required in all cases (even if a video or guided tour exists). Used when:
  - No video or guided tour is available
  - Video/tour fails to load
  - Org has no access to external content
- PMs provide screenshots that adhere to guidance/specs. Missing screenshots cause scrum team test failures.
- 258: Screenshots appear in English only. Localization exploration is ongoing.
- Clicking a screenshot enlarges it in a modal.

### Video

Narrated overview of a single use case, highlighting business value (not setup or step-by-step usage).

- Preferred first choice for most feature pages
- Ideal for less complex functionality and for 60–90 seconds (~200–225 words)
- Opens in a separate modal when clicked
- Not supported on feature set pages

### Figma Guided Tour

Interactive demo in Figma that simulates Salesforce UI (slides, paced steps, side panel details).

- No longer recommended due to production overhead and stability concerns
- Kept for legacy Sales Cloud features added prior to 256
- If considered, align with PM, UX, and dev resourcing first

### Optional Links

Links to additional Salesforce-owned content that doesn’t have a place elsewhere on the page (for example, marketing blogs, Salesblazer, My Service Journey one-pagers). Avoid duplicates of links already present on the page.

### Screenshot Guidance and Specifications

- File size < 300 KB (recommended)
- Ratio 16:9 or 4:3 preferred
- 200 DPI
- Max size 1920×1080 (exact size flexible; prioritize quality and file size)
- Full-screen capture; no bookmarks or tabs
- No real customer/employee data
- Avoid sparse org data and large whitespace (zoom if needed)
- Show current GA state; no future-facing UI
- Use Cosmos/Kondo UI if applicable
- If same-release GA screenshot is hard to obtain, provide the closest accurate representation (test org or accurate Figma). Engage Go PM team on #tmp-salesforce-go-workgroup if needed.

### Video Timeline, Guidance, and Specifications

Key resources:
- Video requests and prioritization spreadsheet
- Go Video Template
- 260 kickoff deck and recording

Goal: Entice buyers by demonstrating value; do not teach setup or detailed usage.

Selected dates and deliverables:
- 10/3/25 (258 R1): Final 258 video deliverables published (Vidyard links)
- Aug 4 (260): Start requesting videos; add prioritized requests per cloud
- Sep 4 (260): All requests due; ensure priority order
- Sep 8 (260): First 20 videos prioritized; begin scripts
- Sep 24 (260): Remaining videos prioritized; lower-priority may be cut
- Oct 6 (260): Scripts for first 20 due; add script links; late = not guaranteed
- Oct 10 (260): Vidyard links available; add links to metadata; placeholder plays until publish
- Nov 7 (260): Remaining scripts due; late = not guaranteed
- Feb 13, ’26 (260 R1): All videos published (rolling publish until final date)

### Video Process

1) Content Strategists/lead writers request videos per release.
2) Go Content Strategists prioritize across clouds (Agentforce first, then rotate clouds), communicate deadlines.
3) Designated writers draft scripts, gather org credentials, meet deadlines.
4) CX Video team provides Vidyard links (with placeholders until final publish).
5) CX Video team produces and publishes videos on a rolling basis before R1.

Note: Go videos do not require GUS unless needed for personal tracking; production uses the centralized spreadsheet.

### Creating New Videos for Salesforce Go

- Use the Go Video Template
- Demonstrate business value, not setup/how-to
- Length: 60–90 seconds (max ~225 words)
- Voice: 2nd person, present tense (for example: “When you enable this feature, your company can …”)
- Include a title and short description matching the Go feature name/description
- Use provided short intro/outro; voice-over starts immediately; no resources in outro
- Avoid stories, fake companies, and Salesforcelandians
- Avoid animation and on-screen text/bullets
- Host on Vidyard using format: `https://play.vidyard.com/<videoId>.html`

Tip: Videos for Go can be reused in Help, Trailhead, etc.

### Evaluating Existing Videos for Use in Go

You can reuse existing videos if they fit or need only small tweaks. Coordinate with your Content Strategist and PMs to evaluate suitability. All videos used in Go must be hosted in Vidyard (migrate Salesforce-owned YouTube videos to Vidyard if selected).

### Managing Vidyard Link Requests

Links are generated in bulk from the final prioritized list to avoid widespread placeholders at R1. Until your video is complete, a placeholder animation plays at the Vidyard link; it is replaced automatically when the final video is published.

### Figma Guided Tours Guidance and Specifications

Currently not recommended due to framework instability/support. Some legacy tours remain from pre-256 Sales Cloud features.

### Optional Link Guidance

- Use for Salesforce-owned content that doesn’t fit elsewhere on the page
- Do not duplicate links already present (for example, considerations in Activation)
- If no link is provided, fields remain empty and the section hides (no failures)

## Content Assets — Benefits Section (Optional)

Highlights 2–4 additional benefits when admins need more information to decide on activation. Benefits should be unique and not repeat Help content; best for complex features where value isn’t self-evident.

- Placement: Below header pre-activation; below configuration post-activation
- Process: Gather PM input as needed, draft UI text, get SME review, submit via #cx-salesforce-go workflow. CDX ensures alignment with public-facing content.

Graphics:
- Use distinct images per benefit; differentiate My Service Journey images per card (consistent branding is fine)
- If one benefit uses an image, all benefits must use images
- 258: CX graphics team provides a limited image set for prioritized pages (prioritized by Go PMs)
- Images must be relevant to the benefit; do not use screenshots (non-translatable)

## Content Assets — Links to Help, Trailhead, etc.

Content assets are links opened from standard UI text locations (for example, Turn On card, configuration cards, Resources section). UI text = words on the page; assets = off-page content opened from those links.

General Guidelines:
- Assets are optional and can be omitted/hidden (screenshot is the only required asset)
- Link only to accurate, current, CX-maintained content
- Prefer admin-focused setup/optimization/business value content; avoid end-user-only material
- Non-standard page designs (for example, some Agentforce pages) may locate links in different sections; see Special Considerations below

Selecting Assets:
Feature page assets appear in the Activation (Turn On) card, selected configuration cards, and the Resources section.

1) Activation Card Assets (Turn On {Feature}):
- 1A. Preview Default Settings (label not editable): Link only if a Help topic exists that documents defaults; otherwise hide.
  - Example: Turn on Salesforce Forecasting and Define Forecast Settings
- 1B. See Considerations (label not editable): Link to setup considerations (usage considerations acceptable if combined in one topic).
  - Example: Considerations for Setting Up Einstein Opportunity Scoring
- 1C. Setup Help (label not editable): Link to the highest-level task topic (or implementation guide if no Help equivalent). Prefer Help over PDF if both exist.
  - Example topic: Set Up Sales Emails; Example guide: Sales Engagement Implementation Guide
  - Note: Approved label is “Setup Help” (not “Implementation Guide”).

2) Resources Section Assets (up to 6 subsections; must include Explore Salesforce Help at minimum):
- 2A. Help Topic (required): Container/top topic for the feature area.
  - Label: Feature name or high-level topic name (for example, Partner Relationship Management)
- 2B. Release Notes: Link to the feature container topic in release notes.
  - Label (not editable): New in {Feature/section name}
  - URL example: `https://help.salesforce.com/s/articleView?id=release-notes.rn_sales_agents.htm`
  - Guidance: Avoid embedding release numbers in URLs; validate links each release
- 2C. Trailhead (up to 3 badges):
  - CX-owned or verified maintained; quiz-based (no projects/hands-on); admin-focused; include feature name in badge title/unit
  - Label: Trailhead badge title (for example, Email and Calendar Integrations)
  - Provide module ID (for example, `029b1f79-6086-4850-8b6a-14c6142e6bd6`)
- 2D. Find Customer Inspiration (optional): One `The 360 Blog` article
  - Recent/evergreen; complements Benefits section; skip if not meaningful
  - Label: Blog title edited for length; remove customer names
  - Example URL: `https://www.salesforce.com/blog/asset-service-management/`

3) Inline Links in Configuration Steps (use sparingly):
- Add only when necessary to support a specific step; avoid link overload. Coordinate with Content Design/Strategist.

Special Considerations for Non-Standard Pages:
- Some designs (for example, Agentforce for Sales) place “See Considerations” and “Setup Help” links in template configuration cards rather than the Activation card; scope links to the relevant template/action.
- For guidance on unique designs, reach out to Sarah Marovich, Heather Nix, or Tanushree Nandi.

## UI Text and Asset Tracking

Templates are available to track labels and content assets for features onboarding to Go (256 baseline; 258 updates coming). Templates are pre-populated with required labels/assets and many common optional labels; modify to fit your feature’s configuration. They also include file/field/metadata pointers for scrum teams implementing labels.

- Copy the template, rename for your feature, and customize as needed
- Usage is optional but recommended as a starting point


