const express = require("express");

const router = express.Router();

const { analyzeWebsite } = require("../parser");

router.post("/", async (req, res) => {

    const { url } = req.body;

    if (!url) {

        return res.status(400).json({
            error: "URL is required"
        });

    }

    try {

        const report = await analyzeWebsite(url);

        return res.json(report);

    } catch (err) {

        const message = err.message || "";

        if (
            message.includes("Invalid URL") ||
            message.includes("timed out") ||
            message.includes("HTML")
        ) {

            return res.status(400).json({
                error: message
            });

        }

        return res.status(500).json({
            error: message
        });

    }

});

module.exports = router;