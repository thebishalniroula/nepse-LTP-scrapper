// const var fs = require('fs');
import fs from "fs";

import puppeteer from "puppeteer";
// const puppeteer = import("puppeteer");
(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 2000 });
  // Navigate the page to a URL
  await page.goto("https://merolagani.com/LatestMarket.aspx", {
    waitUntil: "domcontentloaded",
  });

  const data = await page.evaluate(() => {
    const rows = document.querySelectorAll("tr");
    return Array.from(rows).map((row, index) => {
      if (index === 0) {
        return { symbol: "Symbol of the stock", ltp: "Latest trading price" };
      }
      const tds = row.getElementsByTagName("td");
      let result = {};
      Array.from(tds).forEach((td, index) => {
        if (index === 0) {
          result["symbol"] = td.innerText;
        } else if (index === 1) {
          result["LTP"] = td.innerText;
        }
      });
      return result;
    });
  });
  const stringData = JSON.stringify(data);
  try {
    fs.writeFileSync("data.json", stringData);
    // file written successfully
    console.log("File written successfully.");
  } catch (err) {
    console.error(err);
  }
  await browser.close();
})();
