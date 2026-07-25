const axios = require("axios");
const cheerio = require("cheerio");

async function analyzeWebsite(url) {
    try {
        // Validate URL
        new URL(url);

        const startTime = Date.now();

        const response = await axios.get(url, {
            timeout: 10000,
            validateStatus: () => true,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0 Safari/537.36",
                "Accept":
                    "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9"
            }
        });

        const responseTime = Date.now() - startTime;

        const contentType = response.headers["content-type"] || "";

        if (!contentType.includes("text/html")) {
            throw new Error("The URL does not point to an HTML page.");
        }

        const html = response.data;
        const $ = cheerio.load(html);

        const title = $("title").text().trim() || "No title found";

        const metaDescription =
            $('meta[name="description"]').attr("content") ||
            "No meta description found";

        const h1Count = $("h1").length;

        let imagesWithoutAlt = 0;

        $("img").each((i, img) => {
            const alt = $(img).attr("alt");

            if (!alt || alt.trim() === "") {
                imagesWithoutAlt++;
            }
        });

        const bodyText = $("body").text();

        const wordCount = bodyText
            .replace(/\s+/g, " ")
            .trim()
            .split(" ")
            .filter(word => word.length > 0).length;

        return {
            url,
            httpStatus: response.status,
            responseTime: `${responseTime} ms`,
            pageTitle: title,
            metaDescription,
            h1Count,
            imagesMissingAlt: imagesWithoutAlt,
            approximateWordCount: wordCount
        };

    } catch (error) {

        if (error.code === "ECONNABORTED") {
            throw new Error("Request timed out.");
        }

        if (error.code === "ERR_INVALID_URL") {
            throw new Error("Invalid URL.");
        }

        throw new Error(error.message);
    }
}

module.exports = {
    analyzeWebsite
};