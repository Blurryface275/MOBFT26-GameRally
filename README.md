# MOBFT26-GameRally (Chroma Core Alignment)

This project is a client-side game dashboard "Chroma Core Alignment" for testing participant positions at the Game Rally MOB FT 2026 post. The application is built using Next.js (Static Export) and is fully optimized for hosting on **GitHub Pages**.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Open the page in your browser:
   The application will run at [http://localhost:3000](http://localhost:3000).
   *(Note: The `basePath` configuration is dynamically disabled in development mode, allowing the app to run on the standard root path, but automatically re-enabled during production build).*

## Manual Build

To test the static export build locally:
```bash
npm run build
```
The static HTML/CSS/JS output will be generated in the `./out` directory.

## Deployment to GitHub Pages

This project is configured with GitHub Actions for automated deployment.