# Out of Office Run Club

Production website for a Sunday morning social running community in Kharadi, Pune. Built with Next.js 14 App Router for performance and developer velocity.

## Architecture

- **Next.js 14 App Router** — server components for static content, client components for interactive elements (RSVP, calendar)
- **Static generation** — run schedule and route info pre-rendered at build time for instant loading
- **Responsive design** — mobile-first layout optimized for WhatsApp sharing; photo grid with lazy loading
- **Netlify deployment** — instant rollbacks, automatic CI/CD from GitHub, edge caching

## Pages

- **Home** — Hero with next-run countdown, club stats, photo gallery, WhatsApp deep-link CTA
- **Schedule** — Run calendar with past/completed badges, current route info, recurring event details

## Impact

- 40+ runners at launch through organic community growth
- Bi-weekly 5K social runs with consistent 25+ avg attendance
- Sub-100ms page loads globally (Netlify analytics)

## Live Site

https://out-of-office-run-club.netlify.app
