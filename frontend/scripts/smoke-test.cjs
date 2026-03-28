const fs = require("node:fs");
const path = require("node:path");

const distDir = path.resolve(process.cwd(), "dist");
const requiredFiles = ["index.html", "robots.txt", "sitemap.xml", "logo/logo-black.png"];

for (const file of requiredFiles) {
  const fullPath = path.join(distDir, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing built frontend artifact: ${file}`);
  }
}

const indexHtml = fs.readFileSync(path.join(distDir, "index.html"), "utf8");
if (!indexHtml.includes("TOOLMITRA")) {
  throw new Error("Homepage build artifact is missing expected branding content.");
}

console.log("Frontend smoke tests passed.");
