const express = require("express");
const { chromium } = require("playwright");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ Screenshot API using Playwright is running!");
});

app.get("/screenshot", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("❌ URL is required");

  try {
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    const buffer = await page.screenshot({ fullPage: true });
    await browser.close();

    res.type("image/png").send(buffer);
  } catch (err) {
    console.error("❌ Screenshot error:", err);
    res.status(500).send("Screenshot failed123", err);
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
