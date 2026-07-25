const express = require("express");
const cors = require("cors");

const analyzeRoute = require("./routes/analyze");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Page Pulse API is running.",
        endpoint: "/analyze",
        method: "POST"
    });
});

app.use("/analyze", analyzeRoute);

module.exports = app;