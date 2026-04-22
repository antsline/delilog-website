import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const OUTPUT_DIR = path.join(REPO_ROOT, "public", "blog", "keikamotsu-anzentaisaku-2025");
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const targets = [
  { name: "structure", html: "structure.html", width: 1200, height: 800 },
  { name: "retention", html: "retention.html", width: 1200, height: 500 },
];

async function renderTarget(browser, target) {
  const page = await browser.newPage();
  await page.setViewport({
    width: target.width,
    height: target.height,
    deviceScaleFactor: 2,
  });

  const htmlPath = path.join(__dirname, target.html);
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
  await page.evaluateHandle("document.fonts.ready");
  await new Promise((resolve) => setTimeout(resolve, 500));

  const outputPath = path.join(OUTPUT_DIR, `${target.name}.png`);
  await page.screenshot({
    path: outputPath,
    clip: { x: 0, y: 0, width: target.width, height: target.height },
  });

  console.log(`Rendered: ${outputPath}`);
  await page.close();
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  try {
    for (const target of targets) {
      await renderTarget(browser, target);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
