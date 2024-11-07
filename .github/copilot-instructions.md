## Architectural guidelines
When implementing changes, respect the architectural guidelines listed below:
- The application consist of only **one** static HTML page (a Single Page Application) that does not requires any compiling/transpiling/building.
- The application can only use 2 external dependencies:
  1. The `sportlink-to-mailchimp-converter` NPM package
  2. HTMX
- The application is responsive (usable on both desktop and mobile)
- CSS Flexbox is used to realize a responsive layout
