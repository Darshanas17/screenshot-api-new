const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/screenshot", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("Missing URL");

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const screenshot = await page.screenshot();

    await browser.close();
    res.set("Content-Type", "image/png");
    res.send(screenshot);
  } catch (err) {
    console.error("❌ Screenshot failed:", err.message);
    res.status(500).send("Screenshot failed");
  }
});

app.get("/", (req, res) => {
  res.send("✅ Screenshot API is running");
});

app.listen(PORT, () => {
  console.log(`🚀 Screenshot API running on port ${PORT}`);
});
