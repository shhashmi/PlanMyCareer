/**
 * Pre-render public routes to static HTML at build time.
 *
 * This script:
 * 1. Starts a static file server on the Vite build output (dist/)
 * 2. Uses Puppeteer to load each public route
 * 3. Saves the fully-rendered HTML so crawlers see content instead of an empty <div id="root">
 *
 * Usage: node scripts/prerender.mjs
 * Run after `vite build` (configured as "postbuild" in package.json)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = resolve(__dirname, '..', 'dist');
const PORT = 4173;

// All 11 public routes to pre-render
const PUBLIC_ROUTES = [
  '/',
  '/skills',
  '/login',
  '/how-it-works',
  '/pricing',
  '/faq',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-of-use',
  '/refund-policy',
];

/**
 * Simple static file server that serves the Vite build output.
 * Falls back to index.html for SPA client-side routing.
 */
function startServer() {
  return new Promise((resolvePromise) => {
    const server = createServer((req, res) => {
      const url = req.url.split('?')[0];
      const filePath = resolve(DIST_DIR, url === '/' ? 'index.html' : url.slice(1));

      try {
        if (existsSync(filePath) && !filePath.endsWith('/')) {
          const content = readFileSync(filePath);
          const ext = filePath.split('.').pop();
          const mimeTypes = {
            html: 'text/html',
            js: 'application/javascript',
            css: 'text/css',
            png: 'image/png',
            jpg: 'image/jpeg',
            svg: 'image/svg+xml',
            json: 'application/json',
            woff2: 'font/woff2',
            woff: 'font/woff',
          };
          res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
          res.end(content);
        } else {
          // SPA fallback — serve index.html for all routes
          const indexHtml = readFileSync(resolve(DIST_DIR, 'index.html'));
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(indexHtml);
        }
      } catch {
        const indexHtml = readFileSync(resolve(DIST_DIR, 'index.html'));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(indexHtml);
      }
    });

    server.listen(PORT, () => {
      console.log(`  Static server running on http://localhost:${PORT}`);
      resolvePromise(server);
    });
  });
}

async function prerender() {
  console.log('\n🔍 Pre-rendering public routes...\n');

  if (!existsSync(DIST_DIR)) {
    console.error('  ✗ dist/ directory not found. Run "vite build" first.');
    process.exit(1);
  }

  const server = await startServer();
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let successCount = 0;

  for (const route of PUBLIC_ROUTES) {
    try {
      const page = await browser.newPage();

      // Block unnecessary resources to speed up rendering
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const type = req.resourceType();
        if (['image', 'font', 'media'].includes(type)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 15000,
      });

      // Wait a bit for React to finish rendering
      await page.waitForSelector('#root > *', { timeout: 10000 });

      const html = await page.content();
      await page.close();

      // Determine output file path
      const outputPath = route === '/'
        ? resolve(DIST_DIR, 'index.html')
        : resolve(DIST_DIR, route.slice(1), 'index.html');

      // Ensure directory exists
      const outputDir = dirname(outputPath);
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      writeFileSync(outputPath, html);
      successCount++;
      console.log(`  ✓ ${route}`);
    } catch (error) {
      console.error(`  ✗ ${route}: ${error.message}`);
    }
  }

  await browser.close();
  server.close();

  console.log(`\n  Pre-rendered ${successCount}/${PUBLIC_ROUTES.length} routes.\n`);
}

prerender().catch((error) => {
  console.error('Pre-rendering failed:', error);
  process.exit(1);
});
