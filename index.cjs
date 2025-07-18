const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ Screenshot API is running!");
});

app.get("/screenshot", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("❌ URL is required");

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    const screenshotBuffer = await page.screenshot({ fullPage: true });
    await browser.close();

    res.set("Content-Type", "image/png").send(screenshotBuffer);
  } catch (err) {
    console.error("❌ Screenshot error:", err);
    res.status(500).send("Screenshot failed");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
