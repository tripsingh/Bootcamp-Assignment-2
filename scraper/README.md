# Udyam Registration Scraper

This scraper extracts form schema information (labels, input ids, placeholders, button names, input types) for the first two steps of the Udyam Registration page and writes it to `schema.json`.

Usage:

```bash
cd scraper
npm install
# optionally override target URL:
export UDYAM_URL="https://udyamregistration.gov.in/Udyam_Registration"
npm start
```

Environment variables:
- `UDYAM_URL`: override the default registration page URL.
- `HEADLESS=false`: run browser visible for debugging.

Output: `schema.json` in the `scraper` folder.
