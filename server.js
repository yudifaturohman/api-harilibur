import express from "express";
import path from "path";
import fsPromises from "fs/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.get("/api", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=86400");

  try {
    let result = [];
    let year = new Date().getFullYear();

    let text = await fsPromises.readFile(
      path.join(__dirname, "data", `${year}.json`),
      "utf8"
    );

    let { month } = req.query;
    if (req.query.year) {
      year = req.query.year;
      text = await fsPromises.readFile(
        path.join(__dirname, "data", `${year}.json`),
        "utf8"
      );
    }

    let parseResult = JSON.parse(text);

    if (month && year) {
      result = parseResult.filter((item) => {
        if (new Date(item.holiday_date).getMonth() + 1 == month) {
          return item;
        }
      });
    } else if (year) {
      result = parseResult;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(200).json([]);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});