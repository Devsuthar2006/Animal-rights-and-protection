# AI Coding Agent Instructions - Animal Rights & Protection Website

## Project Overview
This is a static HTML website for an animal rights organization built with vanilla HTML, Tailwind CSS, and JavaScript. The site consists of 5 pages with consistent navigation, styling, and interactive features.

## Architecture & Structure
```
├── index.html          # Home page with hero section and overview
├── about.html          # Organization story, team profiles, impact stats
├── campaigns.html      # Campaign showcase with interactive modals
├── donate.html         # Donation options and volunteer forms
├── contact.html        # Contact form with client-side validation
└── README.md          # Deployment and project documentation
```

## Key Design Patterns

### Consistent Page Structure
All pages follow this exact pattern:
1. **Head section**: Same meta tags, CDN imports (Tailwind, Font Awesome, Google Fonts, AOS)
2. **Navigation**: Sticky header with responsive mobile menu (`mobile-menu-btn` toggles `mobile-menu`)
3. **Hero section**: Full-screen background image with overlay (`hero-bg` class)
4. **Content sections**: Using `data-aos` attributes for scroll animations
5. **Footer**: Consistent contact info and social links

### CSS Architecture
- **Framework**: Tailwind CSS via CDN (no custom CSS files)
- **Custom styles**: Inline `<style>` blocks in each HTML file containing:
  - Puppy cursor animation (`.puppy-cursor`, `.puppy-trail`)
  - Hero background gradients (`.hero-bg`)
  - Button hover effects (`.btn-primary`, `.btn-secondary`)
  - Card animations (`.card-hover`)

### Color Scheme & Typography
- **Primary colors**: Green (`#10b981`), Amber (`#f59e0b`), Gray (`#374151`)
- **Font**: Poppins (300, 400, 500, 600, 700 weights)
- **Icons**: Font Awesome 6.4.0 with animal-themed icons (`fa-paw`, `fa-heart`, etc.)

## Interactive Features

### Puppy Cursor Animation
Every page includes identical JavaScript for a custom puppy cursor:
- Follows mouse movement with smooth animation (`requestAnimationFrame`)
- Creates trailing effect with auto-cleanup
- Disabled on mobile (`window.innerWidth <= 768`)
- Uses SVG data URL for puppy icon

### Modal System (campaigns.html)
```javascript
// Standard pattern for campaign modals
const modal = document.getElementById('modal-id');
const openBtn = document.getElementById('open-btn');
const closeBtn = document.querySelector('.close');

openBtn.onclick = () => modal.style.display = 'block';
closeBtn.onclick = () => modal.style.display = 'none';
```

### Form Validation (contact.html, donate.html)
- Client-side validation with `addEventListener('submit')`
- Email regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Required field checking before submission
- Uses `alert()` for user feedback (production would need server integration)

## Development Conventions

### File Naming & Organization
- All HTML files in root directory
- Descriptive, lowercase filenames
- No separate CSS/JS files - everything inline for simplicity

### CDN Dependencies
Always load in this order:
1. Tailwind CSS
2. Font Awesome
3. Google Fonts (Poppins)
4. AOS (Animate on Scroll)

### Responsive Design
- Mobile-first approach with Tailwind breakpoints
- Hamburger menu for mobile (`md:hidden` / `hidden md:block`)
- Puppy cursor disabled on mobile devices
- Hero sections use `background-attachment: fixed` (may need `scroll` on mobile)

### Image Strategy
- Hero backgrounds: Unsplash URLs with specific dimensions (2070px width)
- Consistent overlay pattern: `rgba(0, 0, 0, 0.4)` or `rgba(0, 0, 0, 0.5)`
- No local image assets - everything via external URLs

## Deployment Notes
- Static site ready for GitHub Pages, Netlify, or Vercel
- No build process required
- All dependencies loaded via CDN
- Consider adding CSP headers for production

## Common Modifications
When adding new pages:
1. Copy navigation structure from existing page
2. Update active navigation state (green color for current page)
3. Include puppy cursor JavaScript block
4. Follow hero section → content → footer pattern
5. Add AOS animations to content sections (`data-aos="fade-up"`)

When adding interactive elements:
- Use existing button classes (`.btn-primary`, `.btn-secondary`)
- Follow modal pattern from `campaigns.html`
- Add hover animations with `.card-hover` class
- Maintain consistent spacing with Tailwind utilities