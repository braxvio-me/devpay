# DevPay Africa — UI/UX Reference Specification

Extracted directly from reference designs in `c:\Users\pc\Desktop\devpay\ui`:
- `freelancestr.jpg` (Spacing Cheat Sheet)
- `freelanceho.jpg` / `freelance1.jpg` (Home / Explore Screen)
- `freelance2.jpg` / `freelanceapp.jpg` (Job & Milestone Details Screen)
- `freelance3.jpg` (Search & Filter Results Screen)
- `Screenshot 2026-10-23 165026.png` (Onboarding / Welcome Screen)

---

## 1. Color Palette & Design Tokens

### Primary & Accent Colors
- **Primary Brand Blue:** `#0F73F7` (Deep energetic sapphire blue)
- **Gradient Cyan Accent:** `#38BDF8` (Vibrant sky cyan)
- **Primary Card Gradient:** `linear-gradient(135deg, #0F73F7 0%, #38BDF8 100%)`
- **Soft Ambient Blue:** `#EBF3FE` / `#F0F6FF` (Subtle tint for backgrounds, reminder cards, and active tags)
- **Bookmark / Alert Coral:** `#FF4D4D` (Accent red for bookmarks and notification dots)
- **Verified / Trusted Green:** `#10B981` (Checkmark icon and verified text)

### Neutral & Surface Colors
- **Background:** `#F8FAFC` (Clean, modern soft off-white canvas)
- **Card Surface:** `#FFFFFF` (Pure white card surfaces)
- **Frosted Glass (Bottom Nav & Floating Bars):** `rgba(255, 255, 255, 0.92)` with blur
- **Borders & Dividers:** `#E8EFF8` / `#EEF3FA`
- **Text Primary (Headings & Titles):** `#0F172A` (Rich obsidian slate)
- **Text Secondary (Subtitles & Labels):** `#64748B` (Neutral slate gray)
- **Text Muted / Placeholders:** `#94A3B8` (Soft muted slate)

---

## 2. Layout & Spacing (Exact Specifications from `freelancestr.jpg`)

- **Canvas Baseline:** 390px width × 844px height (iPhone standard)
- **Grid Layout:** 4 Columns, Stretch, **Margin: 20px**, **Gutter: 20px**
- **Top Header Bar:** 60px height (Profile avatar left, 45px circular notification bell right)
- **Header & Search Section:** 165px
- **Vertical Section Gap:** 24px
- **Recommended Card Dimensions:** 200px height, 260px–270px width, 24px border radius
- **Latest Post Card:** 20px border radius, 16px padding, subtle border `1px solid #EEF3FA`
- **Floating Bottom Navigation Bar:**
  - Floating pill anchored 24px above screen bottom
  - 20px horizontal margin
  - Height: ~68px
  - 32px border radius
  - Center Action Button: 48px × 48px squircle with cyan-blue gradient and glowing shadow

---

## 3. Screen Breakdown

### Screen A: Onboarding & Welcome (`Screenshot 2026-10-23 165026.png`)
- **Hero Visual:** Curved arc of user face avatars in organic oval frames with white borders + center `+` icon, set against a soft ambient sky blue backdrop.
- **Bottom Sheet Card:** Crisp white surface with rounded top corners (32px radius).
- **Headline:** *"Connect with Africa's top freelancers and get paid securely."*
- **Subheadline:** *"Discover verified talent, protect milestones with escrow, and receive instant payouts."*
- **Social Auth Row:** Side-by-side white pill buttons with Google and Apple logos.
- **Primary CTA:** Black pill button *"Get Started"*.
- **Footer:** *"Already have an account? Sign In"*.

### Screen B: Freelancer Home / Explore (`freelanceho.jpg`)
- **Top Bar:** Avatar with status dot + Location dropdown (*"My Location: Accra, Ghana"*) + Bell icon with red notification badge.
- **Reminder Banner:** Light blue pill with stopwatch icon, *"Milestone deliverable due in 2 hours"*, countdown pill *"9 : 4 5"*.
- **Search Bar:** Pill input *"Search projects, skills..."* with search icon left, filter adjustment icon right.
- **Category Filter Pills:** Horizontal scroll: *"All"*, *"Tech & Dev"*, *"UI/UX Design"*, *"Writing"*, *"Marketing"*.
- **Recommended Section (Horizontal Carousel):**
  - Gradient card (`#0F73F7` ➔ `#38BDF8`):
    - Client logo, Company name, Verified checkmark *"Trusted"*
    - Job title: *"Senior React Native Engineer"*
    - Budget: *"GH₵ 3,500 - 5,000 / Milestone"*
    - Applicant face stack (`+12`)
    - Red bookmark icon
    - Pill button *"Apply ↗"*
- **Latest Post Section (Vertical Feed):**
  - White cards with company logo, title, salary, pill tags (*"Fixed-Price"*, *"Remote"*, *"Milestone"*), bookmark, and apply button.
- **Floating Bottom Nav:** Home, Jobs, Center Floating Action Button, Chats, Profile.

### Screen C: Job / Milestone Details (`freelanceapp.jpg`)
- **Top Nav:** Back chevron left, Client name with verified badge center, Red bookmark right.
- **Hero Card:** Overlapping circular company logo, Job Title, Budget range (`GH₵ 2,500 - GH₵ 4,000`).
- **Pill Badges:** *"Fixed-Price"*, *"On-Site/Remote"*, *"Milestone 1 Funded"*.
- **Segmented Control:** *"Description"* (active) vs *"Company"*.
- **Key Metrics Grid:** Job Type (Briefcase), Working Hours (Clock), Workplace Type (Location).
- **Job Details:** Scoped description paragraph with *"Read More"*.
- **Requirement Summary:** Experience level (2–4 Years), Location (Accra / Remote).
- **Sticky Bottom Action Bar:** Gradient pill *"Apply Now"* with sliding chevrons `> > > >`.

### Screen D: Search & Filter Directory (`freelance3.jpg`)
- **Top Bar:** Search input with microphone button & user avatar.
- **Filter Row:** *"Filters ∨"* dropdown + active filter chips (*"UI/UX Designer"*, *"Graphic Designer"*, *"Mobile Dev"*).
- **Counter:** *"212 Jobs Found"* with *"See all >>"*.
- **Job Feed:** Vertical cards with company logo, tags, and *"Apply ↗"*.
- **Floating Toggle:** Bottom segmented pill *"Saved"* vs *"Applied"*.
