# Assist.Prof.Dr. Aniwat Phaphuangwittayakul — Academic Portfolio

A clean, elegant academic portfolio website for **Assist.Prof.Dr. Aniwat Phaphuangwittayakul**, Assistant Professor & AI Researcher at the International College of Digital Innovation, Chiang Mai University.

## Preview

Open `index.html` in any modern browser — no build step required.

## Project Structure

```
├── index.html          # Main HTML page
├── prof-styles.css     # Academic stylesheet
├── prof-script.js      # Interactive JavaScript
├── profile.png         # Profile photo
├── .gitignore
└── README.md
```

## Features

### Design
- Scholarly aesthetic with serif headings (Playfair Display) and clean sans-serif body (Source Sans 3)
- Muted navy & gold color palette
- Responsive layout for desktop, tablet, and mobile
- Print-friendly styles
- Reduced-motion accessibility support

### Sections
- **About** — Profile card with photo, bio, research tags, and animated stat counters
- **Education** — Vertical timeline (D.Eng., M.S., B.Sc.)
- **Research Interests** — Card grid covering Computer Vision, Complex Networks, Knowledge Discovery, Generative Models, and Few-Shot Learning
- **Publications** — 21 peer-reviewed papers with year filters, animated bar chart, and staggered reveal animations
- **Teaching** — 5 courses at ICDI, Chiang Mai University
- **Interactive AI Demos** — Computer vision analysis, AI text generation, and research paper similarity search

### Interactivity
- Scroll progress bar
- Animated stat counters on scroll
- Publication bar chart with staggered bar animation
- Publication year filtering with fade transitions
- Scroll-reveal animations via Intersection Observer
- Research tag ↔ card hover linking
- Navigation scroll spy with smooth scrolling
- Mobile-responsive slide-in menu
- Keyboard navigation (Arrow keys between sections, Escape to close menu)

## Tech Stack

- **HTML5 / CSS3 / Vanilla JavaScript** — zero build dependencies
- **Google Fonts** — Playfair Display, Source Sans 3
- **Font Awesome 6** — icons

## Development

Serve locally with any static server:

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Then open [http://localhost:8080](http://localhost:8080).

## License

© 2025 Aniwat Phaphuangwittayakul. All rights reserved.
