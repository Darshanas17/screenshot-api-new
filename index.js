import express from "express";
import puppeteer from "puppeteer";

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
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--single-process",
        "--no-zygote",
      ],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    const buffer = await page.screenshot({ fullPage: true });
    await browser.close();

    res.type("image/png").send(buffer);
  } catch (err) {
    console.error("❌ Screenshot error:", err.stack || err);
    res.status(500).send("Screenshot failed");
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
